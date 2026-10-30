# Plan: save to a Google Drive folder

Status: plan only, nothing built. Do it after the current Marketplace review is approved: it adds an OAuth scope, so it needs a new Marketplace and OAuth review of its own.

## Why

The competitor ("Extract and download images", subscription) can save images to the user's computer, to Drive, or both. People who work in Docs often want the files next to the Doc, or want to hand a folder link to a client without a ZIP in the middle. Pluckr only downloads to the device today.

## What the user sees

1. In the sidebar, a new checkbox under Output settings: **Also save to Google Drive**.
2. Press the main button as usual. After the files are ready, Pluckr creates (or reuses) a Drive folder named `<Doc name> images` and uploads the same files that go into the ZIP: the converted or original images, plus `images-metadata.csv` / `.json` and `content.md` when those are ticked.
3. A line under the button shows progress ("Saving 3 of 12 to Drive") and ends with a link: **Open folder in Drive**.
4. Picking Drive without the download is a second checkbox state: a "Save to Drive instead of downloading" option, so a user with a locked-down laptop can skip the browser download.

Only the images that are ticked in the list are saved, as with every other export.

## Scope and review impact

| | |
|---|---|
| New scope | `https://www.googleapis.com/auth/drive.file` |
| Sensitivity | Not a restricted scope. It gives access only to files the app creates or the user opens with it, so it should not need the restricted-scope security assessment. Confirm in the OAuth consent screen when adding it. |
| Why not `DriveApp` | `DriveApp.createFile` and `createFolder` need the full `drive` scope, which is restricted. With only `drive.file` granted those calls fail. Use the **Drive advanced service** (v3) instead: `Drive.Files.create` works with `drive.file`. |
| Manifest | Add the scope to `oauthScopes` and `"dependencies": { "enabledAdvancedServices": [{ "userSymbol": "Drive", "serviceId": "drive", "version": "v3" }] }`. |
| Review | Update the Cloud OAuth consent screen (scope list and justification), resubmit for verification, and update the Marketplace SDK scopes. A changed scope list triggers a fresh review of the listing. Expect days to weeks; do not combine with other listing edits. |
| Policies | Privacy policy: new section "Files saved to your Drive" (created at your request, in your Drive, never touched by Pluckr's servers). Terms: one sentence. Limited Use statement stays true. |
| Users | Existing users get a new consent prompt the next time they run the add-on. Say so in the release notes. |

Spike first, before any UI: confirm in a throwaway Apps Script project that `Drive.Files.create` with a base64 blob and `drive.file` alone creates a folder in My Drive and files inside it, and that the folder can be found again.

## Technical design

### Server (`apps-script/Code.gs`)

- `getDriveFolder(entitlement)`: returns `{ id, url }` for this Doc's images folder.
  - Remembers the folder in `PropertiesService.getDocumentProperties()` under `driveFolderId` (allowed under `@OnlyCurrentDoc`; the property travels with the Doc).
  - If the stored id no longer resolves (deleted or trashed) create a new folder.
  - Name: `<Doc name> images`. Created in My Drive root. No Picker in v1 (it needs an API key and a developer key in the consent flow).
- `saveFileToDrive(folderId, name, mimeType, base64, entitlement)`: uploads one file with `Drive.Files.create({ name, parents: [folderId], mimeType }, blob)`; returns `{ id, webViewLink }`. One file per call so a failure loses one file, not the batch, and each call stays well under the `google.script.run` payload limit.
- Both functions call `requireEntitlement_` first, like every other call.
- Name clashes: if a file with the same name exists in the folder, update it instead of making a duplicate (`Drive.Files.list` with `q: name = '…' and '<folder>' in parents and trashed = false`, then `Drive.Files.update`). This makes a second export idempotent.

### Client (`src/main.jsx`, `src/bundle.js`)

- Build the same entries list used for the ZIP. Extract `buildEntries()` out of `downloadAll` so ZIP and Drive share it.
- Add `driveFiles(entries, { metadata, markdown })` to `bundle.js` that yields `{ name, blob }` for every file (images, CSV, JSON, `content.md`) so Drive gets the same content as the ZIP. Pure, tested in `scripts/test-features.mjs`.
- Upload sequentially with `serverCall('saveFileToDrive', …)`, base64 via the existing `blobToBase64`. Progress state `{ done, total }`; stop on the first error and say which file failed. Retry button re-sends only what is left.
- Result line with the folder link (`target="_blank" rel="noopener noreferrer"`).
- New settings state `saveToDrive: false` and `driveOnly: false`; both off by default. Both follow the rule that a collapsed Output settings means no extras.

### Limits and edge cases

- Apps Script call limits: about 6 minutes per execution, per-call payload up to roughly 50 MB, daily Drive write quotas. A 100-image Doc at 10 uploads a second is fine; very large originals (tens of MB each) may need a warning.
- Shared drives and "Shared with me" Docs: the folder is created in the **user's** My Drive, not next to the Doc. Say so in the result line.
- A user who has not granted Drive access (consent skipped): the call fails with an authorization error. Show "Allow Drive access to save here" and run `ScriptApp.requireScopes` / re-prompt through the normal consent path.
- Do not read or list anything in Drive that Pluckr did not create. `drive.file` enforces this, and the code should not try.

## Tests

- `scripts/test-features.mjs`: mocks for `Drive.Files.create/list/update` and `PropertiesService.getDocumentProperties`; checks folder reuse, stale folder id recovery, overwrite on a second run, the entitlement gate on both calls, and `driveFiles()` contents.
- Manual: real Doc with 5 images, run twice; run with a deleted folder; run as a second user with no prior consent.

## Rollout

1. Spike (above).
2. Build behind the manifest change on a branch; test with the reviewer account.
3. Update privacy/terms and the Marketplace listing's data-access text in the same change.
4. Submit scope change to OAuth verification and the Marketplace together; keep the live version unchanged until both pass.
5. Release as the next numbered script version and re-point the listing.

Effort: about 2 days of build and tests; the schedule is dominated by the review.

## Open questions

- Folder placement: root of My Drive (simple, v1) or next to the Doc (needs the Doc's parent, which needs more access than `drive.file` gives)? Assume root.
- Should "save to Drive" be a paid-tier extra? Pluckr is one price today; keep it included.
- Do users want a Picker to choose an existing folder? Collect requests after v1 before adding the API key and Picker setup.
