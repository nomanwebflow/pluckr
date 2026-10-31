// Cloudflare Pages Function: send www.docpluckr.com to the apex with a 301, keeping path and query.
// (A hostname redirect cannot live in _redirects, and this avoids a dashboard rule.)
export function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'www.docpluckr.com') {
    url.hostname = 'docpluckr.com';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
