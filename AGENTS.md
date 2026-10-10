# Architecture rules

- Store separator color preferences in the shared settings store and resolve their CSS token through the color helper so theme defaults and user overrides remain consistent.
- Resolve theme-specific logos through a shared theme selector using CDN asset pointers so year-based branding stays consistent.
- Use theme-supplied scalable silhouette masks for sloping legacy tabs so each year's corner geometry preserves the trapezoid shape.
- Apply legacy silhouette masks only to tab background layers, never to tab contents, so overlapping shapes cannot clip labels or controls.
- Resolve window-style selection and Aero eligibility through shared settings helpers so presets, tab-strip controls, and persisted preferences agree.
- Resolve saved pill color preferences through the shared chrome color helper into a CSS token so automatic contrast and manual overrides use the same rendering path.