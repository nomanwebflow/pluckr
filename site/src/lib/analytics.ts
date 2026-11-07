type Gtag = (command: "event", name: string, params?: Record<string, string>) => void;

/** Sends a GA event through the gtag that layout.tsx defines. Does nothing if the tag has not loaded yet. */
export function trackEvent(name: string, params?: Record<string, string>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
