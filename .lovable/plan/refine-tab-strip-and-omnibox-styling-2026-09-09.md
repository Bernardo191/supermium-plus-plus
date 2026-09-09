# Refine tab strip and omnibox styling

## Changes
- Restore Chrome-like vertical separators between inactive tabs, hiding them beside the active tab.
- Add a separate omnibox color picker in Appearance settings, including default and rainbow choices.
- Make the 2010 tabs use the same trapezoid silhouette as 2016.
- Keep the 2016 trapezoid silhouette while softening its top corners.

## Technical details
- Extend saved appearance settings with an omnibox color value and apply it independently from the toolbar color.
- Add theme-specific tab geometry and separator styling using existing browser color tokens.
- Verify the settings and browser chrome in the live preview.
