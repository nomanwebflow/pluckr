# Pluckr Google Docs add-on

This Apps Script project adds **Pluckr → Extract images** to the Google Docs menu. It scans embedded inline images in every document tab, shows previews with names, dimensions, and file sizes, and lets you download one image or a ZIP archive of the results.

## Build the sidebar

From the project root, run:

```sh
npm install
npm run build:apps-script
```

This bundles the React interface, styles, and local icons into `apps-script/Sidebar.html`. Apps Script serves that file in its sidebar; the Google Apps Script code stays in `Code.gs`.

## Load it in a Google Doc

1. Open a Google Doc and choose **Extensions → Apps Script**.
2. In the Apps Script project, replace the starter script with `Code.gs` and add the generated `Sidebar.html` HTML file.
3. Open **Project Settings**, enable **Show "appsscript.json" manifest file in editor**, then replace the manifest with `appsscript.json`.
4. Save the project and reload the Doc. Choose **Pluckr → Extract images** and approve access to the current document when Google prompts.

The requested scope is limited to the open document (`documents.currentonly`). The image archive is assembled in Apps Script and returned to the sidebar for download. This source project is ready to test; it has not been published to the Google Workspace Marketplace.

## What it extracts

The add-on reads embedded inline images in the document body, including images nested in tables and in nested document tabs. It does not currently extract floating drawings or images placed in headers, footers, or footnotes.

## Push without pasting (clasp)

One-time setup:

1. Enable the Apps Script API at https://script.google.com/home/usersettings.
2. `npx clasp login`
3. In the Doc, open **Extensions → Apps Script → Project Settings** and copy the **Script ID** into `.clasp.json`.

Then every change is one command:

```sh
npm run push
```

This rebuilds `Sidebar.html` and uploads `Code.gs`, `Sidebar.html` and `appsscript.json`. Reload the Doc to see the update.
