import type { AuthConfig } from "convex/server";

// The add-on sends the Google ID token from ScriptApp.getIdentityToken().
// GOOGLE_CLIENT_ID must equal that token's `aud`; see the setup notes in docs/paid-setup.md.
export default {
  providers: [
    {
      domain: "https://accounts.google.com",
      applicationID: process.env.GOOGLE_CLIENT_ID!,
    },
  ],
} satisfies AuthConfig;
