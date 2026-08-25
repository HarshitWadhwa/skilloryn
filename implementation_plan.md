# Apply Sunset Sand Color Palette

The goal is to apply the "Sunset Sand" color palette across the entire Skilloryn website, replacing the current dark slate/fuchsia/cyan theme.

## User Review Required

> [!WARNING]  
> Changing the color palette across the entire website requires modifying almost every component to ensure consistent text contrast, backgrounds, and accents.

## Open Questions

> [!IMPORTANT]  
> **Question 1: Dark Glass vs. Clean Light Theme**  
> In your previous requests, we built a **dark mode** "liquid glass / glassmorphism" aesthetic. The "Sunset Sand" preview in your image shows a **light mode** main area with a solid dark brown sidebar. 
> 
> Do you want to:
> **Option A:** Keep the **dark mode liquid glassmorphism** style, but tint everything with the Sunset Sand colors (dark mahogany backgrounds, glowing amber/orange accents)?
> **Option B:** Switch to the **clean light theme** shown in the image (solid dark brown sidebar `#4A2C2A`, light cream background `#FFFBF6`, white cards, orange accents)?

> [!IMPORTANT]  
> **Question 2: Glassmorphism in Light Theme?**
> If you choose Option B (Light theme), do you still want heavy glassmorphism (translucent white cards over a cream background) or should we use solid white cards with shadows as shown in the mockup?

## Proposed Changes

We will define the Sunset Sand palette in `tailwind.config.ts`:
- **Primary Dark (Sidebar/Headers):** `#4A2C2A`
- **Accent (Buttons/Highlights):** `#F59E0B`
- **Secondary Accent:** `#FDBA74`
- **Soft Accent / Backgrounds:** `#FEF3E2`
- **Main Background:** `#FFFBF6`

### Global Configurations

#### [MODIFY] `tailwind.config.ts`
- Add the `sunset` color palette to the theme.

#### [MODIFY] `index.css`
- Update global body background colors.

### Dashboards

#### [MODIFY] `StudentDashboard.tsx`, `CompanyDashboard.tsx`, `InstitutionDashboard.tsx`
- Update sidebar backgrounds to use `#4A2C2A`.
- Update main content area backgrounds.
- Change `text-white` to dark text colors (if moving to light theme).
- Replace fuchsia/cyan/violet accents with amber/orange (`sunset-500`, `sunset-300`).

### Landing Pages

#### [MODIFY] `LandingPage.tsx`, `Hero.tsx`, `Features.tsx`, `Roles.tsx`, `WorkspaceSelector.tsx`
- Update the background gradients and glow effects to use the Sunset Sand colors.
- Adjust text colors for contrast.

## Verification Plan

### Automated Tests
- `npm run build` to ensure no syntax errors during the mass replacements.

### Manual Verification
- Review the Landing Page, Workspace Selector, and all three Dashboards to ensure text is readable, colors are cohesive, and the new palette is applied uniformly.
