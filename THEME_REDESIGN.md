# Skilloryn Reference-Matched Theme Refresh

## Direction

The dashboard family now follows the supplied institution reference with a softer **deep navy and warm cream** foundation. The dark rail and priority panels use a calm blue-charcoal rather than a harsh black or saturated blue, while ivory surfaces keep the reading experience light and focused.

| Role in the system | Treatment |
|---|---|
| Primary dark surface | Deep navy `#12273b` |
| Secondary dark surface | Soft navy `#1d3449` |
| Main canvas | Warm mineral paper `#f4f1ea` |
| Card surface | Soft ivory `#fbfaf7` |
| Primary text | Blue-charcoal ink `#162331` |
| Dark-surface copy | Pale ice `#c7d9e1` and cream `#fffaf1` |
| Brand hook | Restrained copper `#b87956` |
| Verification and progress | Muted teal / sage |
| Risk states | Desaturated rose |

## Typography and hierarchy

**Space Grotesk** remains the display and control face for formal, structured headings with a slight geometric hook. **DM Sans** remains the body face for small labels, supporting text, and dense dashboard content. The headline highlight is now a quiet copper underline treatment rather than a bright gradient, keeping emphasis elegant and readable.

## Motion and interaction

Motion is intentionally limited to short ease-out transitions, subtle card lift, a low-intensity cursor-following radial highlight, and the existing functional drawer and route transitions. The cursor layer is decorative only and does not alter layout or interaction logic. `prefers-reduced-motion` remains respected.

## Logo

The supplied institution mark was restyled into a transparent PNG using deep navy and muted sage-teal. It is used in the institution sidebar, mobile header, and university avatar so the brand mark stays synchronized with the reference theme.

## Scope preservation

No application features were removed or redesigned. Existing routes, tab changes, sign-in navigation, workspace selection, mission completion behavior, candidate pipeline behavior, evidence-review opening, and institution analytics interactions remain intact.

## Verification

The project passes `npm run build`. Browser checks covered the landing page, institution workspace, student workspace, and company workspace after restarting the preview server with the final Tailwind configuration. The institution reference state was checked specifically for navy sidebar contrast, dark priority panel readability, logo placement, cream active navigation, muted progress bars, and card hierarchy.
