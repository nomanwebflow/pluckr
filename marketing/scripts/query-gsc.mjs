#!/usr/bin/env node
import { GoogleAuth } from 'google-auth-library';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const KEY_PATH = resolve(process.cwd(), '.secrets/gsc-key.json');
if (!existsSync(KEY_PATH)) {
  console.error('Error: GSC service account key not found at .secrets/gsc-key.json');
  process.exit(1);
}

const SITEMAP_PATH = resolve(process.cwd(), 'site/public/sitemap.xml');
const SITEMAP_URL = 'https://docpluckr.com/sitemap.xml';
const SITE_PROPERTY = 'sc-domain:docpluckr.com';

const args = process.argv.slice(2);
const daysArg = args.find(a => a.startsWith('--days='));
const days = daysArg ? parseInt(daysArg.split('=')[1], 10) : 28;
const showPages = args.includes('--pages');
const opportunitiesOnly = args.includes('--opportunities');
const submitMode = args.includes('--submit');

async function submitAndInspect(client, encodedSiteUrl) {
  console.log(`\n🚀 Submitting sitemap to Google Search Console: ${SITEMAP_URL}`);
  const encodedSitemap = encodeURIComponent(SITEMAP_URL);

  await client.request({
    url: `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps/${encodedSitemap}`,
    method: 'PUT'
  });

  const sitemapInfo = await client.request({
    url: `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps/${encodedSitemap}`,
    method: 'GET'
  });

  console.log(`✅ Sitemap submitted successfully!`);
  console.table([{
    path: sitemapInfo.data.path,
    lastSubmitted: sitemapInfo.data.lastSubmitted,
    lastDownloaded: sitemapInfo.data.lastDownloaded || 'Pending',
    isPending: sitemapInfo.data.isPending,
    errors: sitemapInfo.data.errors || 0,
    warnings: sitemapInfo.data.warnings || 0
  }]);

  if (!existsSync(SITEMAP_PATH)) {
    return;
  }

  const xml = readFileSync(SITEMAP_PATH, 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());

  console.log(`\n🔍 Inspecting ${urls.length} sitemap URLs via GSC URL Inspection API...`);
  const results = [];

  for (const inspectionUrl of urls) {
    try {
      const res = await client.request({
        url: 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
        method: 'POST',
        data: {
          inspectionUrl,
          siteUrl: SITE_PROPERTY
        }
      });
      const idx = res.data.inspectionResult?.indexStatusResult || {};
      results.push({
        url: inspectionUrl.replace('https://docpluckr.com', '') || '/',
        verdict: idx.verdict || 'UNKNOWN',
        coverageState: idx.coverageState || 'Unknown',
        lastCrawl: idx.lastCrawlTime ? idx.lastCrawlTime.split('T')[0] : 'Never'
      });
    } catch (err) {
      results.push({
        url: inspectionUrl.replace('https://docpluckr.com', '') || '/',
        verdict: 'ERROR',
        coverageState: err.message.slice(0, 50),
        lastCrawl: '-'
      });
    }
  }

  console.table(results);
}

async function run() {
  const auth = new GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters']
  });

  const client = await auth.getClient();
  const siteUrl = encodeURIComponent(SITE_PROPERTY);

  if (submitMode) {
    await submitAndInspect(client, siteUrl);
    if (!args.includes('--all')) {
      return;
    }
  }

  const today = new Date();
  const endDate = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const startDate = new Date(today.getTime() - (days + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  console.log(`\n📊 Google Search Console: ${SITE_PROPERTY}`);
  console.log(`📅 Date range: ${startDate} to ${endDate} (${days} days)\n`);

  if (!showPages) {
    const res = await client.request({
      url: `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
      method: 'POST',
      data: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 100
      }
    });

    let rows = res.data.rows || [];
    if (opportunitiesOnly) {
      // Striking distance: positions 8 to 25
      rows = rows.filter(r => r.position >= 8 && r.position <= 25);
      console.log(`🎯 Low-hanging fruit opportunities (Positions 8 to 25):`);
    } else {
      console.log(`🔎 Top queries:`);
    }

    if (rows.length === 0) {
      console.log('No queries found matching the criteria.\n');
    } else {
      console.table(rows.map(r => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: `${(r.ctr * 100).toFixed(1)}%`,
        position: r.position.toFixed(1)
      })));
    }
  }

  if (showPages || args.includes('--all')) {
    const pageRes = await client.request({
      url: `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
      method: 'POST',
      data: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 50
      }
    });

    const pageRows = pageRes.data.rows || [];
    console.log(`📄 Top landing pages:`);
    if (pageRows.length === 0) {
      console.log('No landing pages found.\n');
    } else {
      console.table(pageRows.map(r => ({
        page: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: `${(r.ctr * 100).toFixed(1)}%`,
        position: r.position.toFixed(1)
      })));
    }
  }
}

run().catch(err => {
  console.error('Error querying GSC:', err.message);
  process.exit(1);
});
