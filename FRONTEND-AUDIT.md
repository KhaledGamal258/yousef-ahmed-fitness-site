# Frontend audit update

## Repairs
- Fixed header, CTA, preferences and navigation dimensions across Arabic and English.
- Reserved scrollbar space on both sides to prevent layout jumps when direction changes.
- Rebuilt marquee spacing with equal repeating cells, removing the Arabic loop gap. The pause control is hidden except when keyboard-focused; reduced-motion preferences remain respected.
- Kept hero image slots and footer branding consistent between languages.
- Normalized card, field, tab and modal dimensions; corrected FAQ marker placement.
- Corrected directional keyboard tab navigation and mobile menu outside-click/desktop-resize dismissal.
- Removed duplicate modal dismissal handling and corrected singular journal filter wording.

## Validation
48 layout cases passed in Chromium: Arabic/English, light/dark, at widths 320, 360, 390, 760, 768, 1024, 1100, 1280, 1550, 1600, 1920 and 2560 pixels. Checks cover header geometry parity, horizontal overflow, equal marquee groups and group coverage. Local QA pages are excluded from publication.

Manual checks included mobile menu open/outside-close, modal backdrop and close-button dismissal, Escape dismissal, recipe quantities, calculator result invalidation, disabled calendar download with no selected days, and directional keyboard tabs. Real iOS Safari and Firefox testing remains outstanding. Transformation content still requires approved client photos.

## Rollback
The release immediately before this audit is `e6299e4f911ffc8ff311afe0ec8d2237456729a9`. Revert the audit commit to restore it while preserving history.
