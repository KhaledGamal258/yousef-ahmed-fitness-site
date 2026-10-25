# New update to the website — 2026-10-25

This release brings the reviewed local design to GitHub Pages:

- Responsive layout, consistent left-aligned English branding in the header and footer.
- Arabic/English content and direction, including interactive tools and dialogs.
- Header icon controls for light, dark and system themes, with saved preferences.
- Red accents, corrected WhatsApp icon and direct coach contact.
- Journal with real illustrative photography, recipe samples and a transformation template awaiting approved client photos.
- Rounded tools card and inset tabs; content dialogs dismiss with outside click, close button or Escape.

Local design comparison and QA pages are excluded from the deployment. Draft content remains labelled; stock photos are not client results. Photo sources are in PHOTO-CREDITS.md.

## Previous release and rollback

Previous deployment commit: `7fe0ebc52191678ae0b61d1638f5119ff23cb39a`.
Backup tag: `before-website-update-2026-10-25`.

The entire update is a separate commit named `New update to the website`.
To undo it without rewriting history, run `git revert <update-commit-sha>` and push main. GitHub Pages will deploy the revert. Revert only the update commit, not unrelated later changes.

## Verification

JavaScript syntax checked before publication. Local preview previously verified in Arabic and English at 320, 390, 760 and 1280 widths, including calculator, filters, theme persistence and dialog dismissal.
