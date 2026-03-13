/**
 * NOVA - Keyboard Shortcuts Hook
 * Ermöglicht globale Tastenkombinationen für Navigation und Aktionen
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
  preventDefault?: boolean;
}

/**
 * Hook für globale Keyboard Shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      shortcuts.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
        const metaMatch = shortcut.meta ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler();
        }
      });
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Hook für NOVA-spezifische globale Shortcuts
 */
export function useNovaShortcuts() {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      handler: () => {
        // Quick Actions öffnen (später implementieren)
        console.log('Quick Actions - Coming soon!');
      },
      description: 'Schnellsuche / Quick Actions öffnen',
    },
    {
      key: 'h',
      ctrl: true,
      handler: () => navigate('/welcome'),
      description: 'Zum Dashboard',
    },
    {
      key: 'i',
      ctrl: true,
      handler: () => navigate('/vorfall-melden'),
      description: 'Neuen Vorfall melden',
    },
    {
      key: 'a',
      ctrl: true,
      handler: () => navigate('/ai-act'),
      description: 'AI Act Wizard öffnen',
    },
    {
      key: 'r',
      ctrl: true,
      handler: () => navigate('/risikoanalysen'),
      description: 'Risikoanalysen',
    },
    {
      key: 'p',
      ctrl: true,
      handler: () => navigate('/projekte'),
      description: 'Projekte',
    },
    {
      key: 'n',
      ctrl: true,
      handler: () => navigate('/news'),
      description: 'News',
    },
    {
      key: '?',
      shift: true,
      handler: () => {
        showShortcutsHelp();
      },
      description: 'Tastenkombinationen anzeigen',
      preventDefault: false,
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

/**
 * Zeigt Hilfe-Dialog mit allen Tastenkombinationen
 */
function showShortcutsHelp() {
  const helpText = `
NOVA Tastenkombinationen:

Navigation:
• Strg+H - Dashboard
• Strg+I - Vorfall melden
• Strg+A - AI Act Wizard
• Strg+R - Risikoanalysen
• Strg+P - Projekte
• Strg+N - News

Aktionen:
• Strg+K - Schnellsuche (Coming soon)
• Strg+S - Speichern (in Formularen)
• Esc - Dialog schließen

Hilfe:
• Shift+? - Diese Hilfe anzeigen

Hinweis: Auf Mac verwende Cmd statt Strg
  `.trim();

  // Einfacher alert für jetzt, später modalen Dialog erstellen
  alert(helpText);
}

/**
 * Komponente: Accessibility Info Button
 */
export function AccessibilityInfoButton() {
  return (
    <button
      onClick={showShortcutsHelp}
      title="Tastenkombinationen anzeigen (Shift+?)"
      aria-label="Tastenkombinationen anzeigen"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#3FB292',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(63, 178, 146, 0.3)',
        fontSize: 20,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      ?
    </button>
  );
}

export default useNovaShortcuts;
