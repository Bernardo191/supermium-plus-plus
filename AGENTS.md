# Architecture rules

- Store separator color preferences in the shared settings store and resolve their CSS token through the color helper so theme defaults and user overrides remain consistent.
- Resolve theme-specific logos through a shared theme selector using CDN asset pointers so year-based branding stays consistent.
- Use theme-supplied scalable silhouette masks for sloping legacy tabs so each year's corner geometry preserves the trapezoid shape.