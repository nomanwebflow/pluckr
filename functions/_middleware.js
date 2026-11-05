// Send www.docpluckr.com to docpluckr.com so each page has one address.
export function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
