#!/usr/bin/env node
import { GoogleAuth } from 'google-auth-library';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const KEY_PATH = resolve(process.cwd(), '.secrets/gsc-key.json');
if (!existsSync(KEY_PATH)) {
  console.error('Error: GSC service account key not found at .secrets/gsc-key.json');
  process.exit(1);
}

const args = process.argv.slice(2);
const daysArg = args.find(a => a.startsWith('--days='));
const days = daysArg ? parseInt(daysArg.split('=')[1], 10) : 28;
const showPages = args.includes('--pages');
const opportunitiesOnly = args.includes('--opportunities');

async function run() {
  const auth = new GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
  });

  const client = await auth.getClient();
  const siteUrl = encodeURIComponent('sc-domain:docpluckr.com');

  const today = new Date();
  const endDate = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const startDate = new Date(today.getTime() - (days + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  console.log(`\n📊 Google Search Console: sc-domain:docpluckr.com`);
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
