/**
 * PBX Exchange Design System - Single Source of Truth
 * Deep navy, muted gold, ivory, and slate across all pages.
 * 
 * USAGE: Import tokens directly, no inline hardcoded colors allowed
 * import { colors, spacing, ... } from '../lib/theme';
 */

// === COLOR TOKENS ===
export const colors = {
  // Primary - PBX Navy
  navy: '#03112B',
  navyDark: '#061A3A',
  navyLight: '#102B57',
  navy700: '#173967',
  
  // Accent - Gold
  gold: '#D6B14A',
  goldDark: '#B7953F',
  goldLight: '#EAD58F',
  
  // Backgrounds
  shell: '#03112B',           // Main app shell background
  card: '#F7F4ED',            // Ivory surfaces
  cardDark: '#F1EDE4',        // Slightly darker surface variant
  input: '#FFFFFF',           // Input field backgrounds
  
  // Text on dark backgrounds (shell)
  textPrimary: '#F7F4ED',
  textSecondary: '#A9B5C8',
  textMuted: '#8E9DB5',
  
  // Text on light backgrounds (cards)
  textDark: '#03112B',
  textDarkSecondary: '#53647E',
  
  // Borders
  borderLight: 'rgba(255,255,255,0.10)',
  borderCard: 'rgba(3,17,43,0.12)',
  
  // Status colors
  success: '#2F9E75',
  warning: '#D69B38',
  error: '#C65A62',
  info: '#4C83C3',
  
  // CTA (Call to Action)
  ctaPrimary: '#D6B14A',        // Muted gold button
  ctaSecondary: '#102B57',      // Navy button
};

// === TAILWIND CLASS MAPPINGS ===
// Use these for consistent styling across components
export const tw = {
  // Shell & backgrounds
  shellBg: 'bg-gradient-to-b from-[#03112B] to-[#061A3A]',
  shellBgSolid: 'bg-[#03112B]',
  cardBg: 'bg-[#F7F4ED]',
  cardBgDark: 'bg-[#F1EDE4]',
  
  // Text
  textOnDark: 'text-[#F7F4ED]',
  textOnDarkMuted: 'text-[#A9B5C8]',
  textOnDarkFaint: 'text-[#8E9DB5]',
  textOnLight: 'text-[#03112B]',
  textOnLightMuted: 'text-[#53647E]',
  
  // Accent
  textGold: 'text-[#D6B14A]',
  bgGold: 'bg-[#D6B14A]',
  
  // Borders
  borderOnDark: 'border-white/15',
  borderOnLight: 'border-gray-200',
  
  // Buttons - Primary (Gold)
  btnPrimary: 'bg-[#D6B14A] text-[#03112B] font-bold hover:bg-[#E0C16A]',
  btnPrimaryDisabled: 'bg-[#D6B14A]/50 text-[#03112B]/50 cursor-not-allowed',
  
  // Buttons - Navy (for light backgrounds)
  btnNavy: 'bg-[#03112B] text-[#F7F4ED] font-semibold hover:bg-[#061A3A]',
  btnNavyDisabled: 'bg-[#03112B]/50 text-white/50 cursor-not-allowed',
  
  // Buttons - Secondary CTA
  btnCta: 'bg-[#102B57] text-[#F7F4ED] font-bold hover:bg-[#173967]',
  
  // Buttons - Secondary (outlined)
  btnSecondary: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
};

// === SPACING & RADIUS ===
export const spacing = {
  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '16px',
  radiusXl: '22px',
  radiusFull: '9999px',
};

// === FX RATE SOURCE LABELS ===
// Always show a source label - never show rate without it
export const fxSourceLabels = {
  openexchangerates: 'Live',
  'exchangerate.host': 'Live',
  dev: 'Dev feed',
  'local-dev': 'Dev feed',
  unknown: 'Indicative',
};

// === GRADIENT PRESETS ===
export const gradients = {
  shell: `linear-gradient(180deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`,
  gold: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
};

// === CSS VARIABLE INJECTION ===
// Call this at app initialization to set CSS custom properties
export function injectThemeVariables() {
  const root = document.documentElement;
  
  // Colors
  root.style.setProperty('--pbx-navy', colors.navy);
  root.style.setProperty('--pbx-navy-dark', colors.navyDark);
  root.style.setProperty('--pbx-navy-light', colors.navyLight);
  root.style.setProperty('--pbx-navy-950', colors.navy);
  root.style.setProperty('--pbx-navy-900', colors.navyDark);
  root.style.setProperty('--pbx-navy-800', colors.navyLight);
  root.style.setProperty('--pbx-gold', colors.gold);
  root.style.setProperty('--pbx-gold-dark', colors.goldDark);
  root.style.setProperty('--pbx-gold-light', colors.goldLight);
  root.style.setProperty('--pbx-bg-shell', colors.shell);
  root.style.setProperty('--pbx-bg-card', colors.card);
  root.style.setProperty('--pbx-text-primary', colors.textPrimary);
  root.style.setProperty('--pbx-text-dark', colors.textDark);
  root.style.setProperty('--pbx-success', colors.success);
  root.style.setProperty('--pbx-error', colors.error);
}

// Default export for convenience
export default {
  colors,
  tw,
  spacing,
  fxSourceLabels,
  gradients,
  injectThemeVariables,
};
