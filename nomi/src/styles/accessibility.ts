/**
 * NOVA - Global Accessibility Styles
 * Stellt sicher, dass alle interaktiven Elemente barrierefrei sind
 */

/**
 * Focus Indicators für Keyboard-Navigation
 * WCAG 2.1 Level AA konform
 */
export const FOCUS_STYLES = `
  :focus-visible {
    outline: 2px solid #3FB292;
    outline-offset: 2px;
    border-radius: 4px;
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #3FB292;
    outline-offset: 2px;
  }

  /* Skip to main content link */
  .skip-to-main {
    position: absolute;
    top: -40px;
    left: 0;
    background: #3FB292;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 100;
    font-weight: 600;
  }

  .skip-to-main:focus {
    top: 0;
  }
`;

/**
 * WCAG Contrast Checker für NOVA Farben
 */
export const WCAG_CONTRAST_RATIOS = {
  // NOVA Green #3FB292 auf weißem Hintergrund
  'NOVA_GREEN_ON_WHITE': {
    ratio: 2.7, // Nicht AA-konform für Text
    recommendation: 'Use #2A8068 (darker green) for text on white (ratio: 4.5)',
    status: 'FAIL',
  },
  // NOVA Dark #183939 auf weißem Hintergrund
  'NOVA_DARK_ON_WHITE': {
    ratio: 12.6, // AAA-konform
    recommendation: 'Perfect for body text',
    status: 'AAA',
  },
  // NOVA Green als Hintergrund mit weißem Text
  'WHITE_ON_NOVA_GREEN': {
    ratio: 2.7, // Nicht AA-konform
    recommendation: 'Use darker shade of green for backgrounds with white text',
    status: 'FAIL',
  },
};

/**
 * Barrierefreie Farbalternativen
 */
export const ACCESSIBLE_COLORS = {
  // Verwende diese für Text auf weißem Hintergrund
  PRIMARY_TEXT: '#2A8068', // Dunkleres NOVA Green (WCAG AA)
  SECONDARY_TEXT: '#183939', // NOVA Dark (WCAG AAA)
  MUTED_TEXT: '#666666', // Grau (WCAG AA)
  
  // Verwende diese für Hintergründe
  PRIMARY_BG: '#2A8068', // Dunkleres Green für Buttons mit weißem Text
  LIGHT_BG: '#F0F7F5', // Sehr helles Green für Hintergründe
  
  // Original NOVA Farben (nur für Akzente, keine kleinen Texte)
  ACCENT_GREEN: '#3FB292',
  ACCENT_DARK: '#183939',
};

/**
 * ARIA Label Templates
 */
export const ARIA_LABELS = {
  navigation: {
    main: 'Hauptnavigation',
    user: 'Benutzermenü',
    footer: 'Fußbereich',
  },
  actions: {
    close: 'Schließen',
    open: 'Öffnen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    submit: 'Absenden',
    logout: 'Abmelden',
    login: 'Anmelden',
  },
  status: {
    loading: 'Lädt...',
    error: 'Fehler aufgetreten',
    success: 'Erfolgreich',
    warning: 'Warnung',
  },
};

/**
 * Keyboard Navigation Hints
 */
export const KEYBOARD_SHORTCUTS = {
  search: { key: 'Ctrl+K', mac: 'Cmd+K', description: 'Schnellsuche öffnen' },
  dashboard: { key: 'Ctrl+H', mac: 'Cmd+H', description: 'Zum Dashboard' },
  newIncident: { key: 'Ctrl+I', mac: 'Cmd+I', description: 'Neuen Vorfall melden' },
  help: { key: '?', mac: '?', description: 'Hilfe anzeigen' },
  closeModal: { key: 'Esc', mac: 'Esc', description: 'Dialog schließen' },
};

/**
 * Mindest-Touch-Größen für mobile Geräte
 * WCAG 2.1 Level AAA: 44x44px
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Screen Reader Only (SR-Only) CSS Class
 */
export const SR_ONLY_STYLES = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sr-only-focusable:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`;

export default {
  FOCUS_STYLES,
  WCAG_CONTRAST_RATIOS,
  ACCESSIBLE_COLORS,
  ARIA_LABELS,
  KEYBOARD_SHORTCUTS,
  MIN_TOUCH_TARGET_SIZE,
  SR_ONLY_STYLES,
};
