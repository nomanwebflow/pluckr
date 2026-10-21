// Talks to Pluckr's licence service (Convex HTTP actions). Empty URL = paywall off (demo/dev, or not configured yet).
const SITE_URL = (import.meta.env.VITE_PLUCKR_LICENCE_URL || '').replace(/\/$/, '');

export const PAYWALL_ENABLED = Boolean(SITE_URL);
export const PRICE_LABEL = import.meta.env.VITE_PRICE_LABEL || '$5';

const SERVICE_DOWN = 'Could not reach the licence service. Check your connection and try again.';

function identityToken(scriptRun) {
  return new Promise((resolve, reject) => {
    scriptRun
      .withSuccessHandler(resolve)
      .withFailureHandler((failure) => reject(new Error(failure?.message || 'Could not read your Google account.')))
      .getIdentityToken();
  });
}

async function post(scriptRun, path, body) {
  const token = await identityToken(scriptRun);
  if (!token) throw new Error('Pluckr needs permission to read your Google email. Choose Log out, then open Pluckr again and approve access.');

  let response;
  try {
    response = await fetch(`${SITE_URL}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, ...(body && { 'Content-Type': 'application/json' }) },
      body: body && JSON.stringify(body),
    });
  } catch (failure) {
    throw new Error(`${SERVICE_DOWN} (${failure?.name || 'Error'}: ${failure?.message || 'request failed'})`);
  }
  if (response.status === 401) throw new Error('Your Google sign-in could not be verified. Choose Log out, then open Pluckr again.');
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error === 'checkout_failed'
      ? 'Checkout is unavailable right now. Please try again in a few minutes.'
      : `${SERVICE_DOWN} (HTTP ${response.status})`);
  }
  return response.json();
}

/** { licensed: false } or { licensed: true, entitlement, expiresAt } (entitlement is checked by the add-on's server code). */
export const fetchLicence = (scriptRun) => post(scriptRun, '/licence');

/** { licensed: true } if already bought, otherwise { url } for a Polar checkout. */
export const createCheckout = (scriptRun) => post(scriptRun, '/checkout', { accepted: true });
