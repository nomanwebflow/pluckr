# Apps Script versions of Pluckr

The Marketplace listing points at one numbered script version. HEAD is the latest code and is never what reviewers or users run.

| Version | Name | What it is | Used by |
|---|---|---|---|
| 1 | Marketplace 1.0 | The first submission. Docs only. The menu is a top-level "Pluckr" menu (`createMenu`). | Rejected on Oct 26, 2026 (trademark attribution and testing credentials) |
| 2 | Marketplace 1.1: menu under Extensions | Version 1 with one change: `createAddonMenu()` instead of `createMenu('Pluckr')`, and the menu label without an em dash. Same scopes (documents.currentonly, script.container.ui, openid, userinfo.email). | **The resubmission** (App Configuration > Docs add-on script version = 2, saved Oct 27, 2026) |
| HEAD | latest code | Slides, alt text, Markdown, optimize, bulk rename, selection, new look. Adds the `presentations.currentonly` scope. | Testing only |
| 3 | Marketplace 2.0: Slides, alt text, Markdown, optimize | Cut from HEAD (commit 7fc7949) on Oct 27, 2026 after the deck test passed. Adds `presentations.currentonly`. | The Slides release (see `docs/slides-rollout.md`) | The Slides release (see `docs/slides-rollout.md`) |

Why version 2 exists: Google's review rules say menu items must appear under the Add-ons menu (Extensions in Docs). Version 1 used a top-level menu while the listing, the post install tip and the reply to the reviewers all say "Extensions > Pluckr > Extract images".

How version 2 was made (Oct 27, 2026): pulled version 1 into a temporary folder with `clasp pull --versionNumber 1`, changed `onOpen`, pushed that to HEAD, ran `clasp version`, then pushed the latest code back to HEAD with `npm run push`. Check any version later with `clasp pull --versionNumber N` in an empty folder that has its own `.clasp.json` (never in `apps-script/`, which would overwrite the working files).

The version 2 `onOpen`:

```js
function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Extract images (Google reads this Doc’s images)', 'openPluckrSidebar')
    .addToUi();
}
```


## Deployments

| Deployment | Version | Note |
|---|---|---|
| `AKfycbxcfNun…zCAiw` | @1 | Marketplace 1.0. Left untouched. |
| `AKfycbxos6bK…bg` | @3 | Marketplace 2.0 (Slides), created Oct 30, 2026 with `clasp deploy --versionNumber 3`. Not referenced by the Marketplace SDK yet. |
| `AKfycbxGJ-Y-…tl-J` | @HEAD | Latest code, for test deployments. |

Never redeploy @1 to a newer version before the new scope is verified: if the SDK reads that deployment, it would go live for existing users.
