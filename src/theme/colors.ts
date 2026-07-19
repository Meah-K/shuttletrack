/**
 * Shared design tokens — colors, spacing, radius, and typography.
 * Both Student App and Driver App import from here so every screen
 * uses the exact same look. Matches Ama's Figma style guide.
 *
 * Owner: Salma
 */

// COLORS — straight from Ama's Figma palette
export const colors = {
  // Brand greens
  primary: '#1B6B33',         // Deep forest green
  primaryDark: '#0F4A22',     // Pressed state
  primaryLight: '#DCEDDF',    // Has Space pill background

  // Status colors
  danger: '#DC3545',          // Full / errors
  dangerLight: '#FCE2E0',     // Full pill / Log out background
  inactive: '#E5E7EB',        // Gray Inactive pill background
  inactiveText: '#6B7280',

  // Surfaces
  background: '#FFFFFF',
  surface: '#F5F5F5',         // Input background
  border: '#E5E7EB',
  borderFocus: '#1B6B33',
  borderError: '#DC3545',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textPlaceholder: '#A8AEB6',
  textOnPrimary: '#FFFFFF',
};

// TYPOGRAPHY — Ama's text style scale
export const typography = {
  display: { fontSize: 48, fontWeight: '800' as const, letterSpacing: 0.5 },
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  label: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };