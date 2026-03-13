import { useEffect, useState, useCallback } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

/**
 * Custom Hook für Browser Push Notifications
 * Handles permission requests und notification management
 */
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if the browser supports notifications
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  /**
   * Request permission from the user
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, permission]);

  /**
   * Show a notification
   */
  const showNotification = useCallback(
    async (options: NotificationOptions): Promise<void> => {
      if (!isSupported) {
        console.warn('Notifications not supported');
        return;
    }

      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          console.warn('Notification permission not granted');
          return;
        }
      }

      const { title, body, icon, tag, requireInteraction, silent } = options;

      const notification = new Notification(title, {
        body,
        icon: icon || '/nova_logo_hexagon.png',
        tag,
        requireInteraction,
        silent,
        badge: '/nova_logo_hexagon.png',
      });

      // Auto-close after 5 seconds if not requireInteraction
      if (!requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      // Optional: Handle notification clicks
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    },
    [isSupported, permission, requestPermission]
  );

  /**
   * Show different notification types
   */
  const notifySuccess = useCallback(
    (title: string, body?: string) => {
      showNotification({ title: `✅ ${title}`, body });
    },
    [showNotification]
  );

  const notifyError = useCallback(
    (title: string, body?: string) => {
      showNotification({
        title: `❌ ${title}`,
        body,
        requireInteraction: true,
      });
    },
    [showNotification]
  );

  const notifyWarning = useCallback(
    (title: string, body?: string) => {
      showNotification({ title: `⚠️ ${title}`, body });
    },
    [showNotification]
  );

  const notifyInfo = useCallback(
    (title: string, body?: string) => {
      showNotification({ title: `ℹ️ ${title}`, body });
    },
    [showNotification]
  );

  /**
   * Compliance-spezifische Notifications
   */
  const notifyComplianceAlert = useCallback(
    (message: string) => {
      showNotification({
        title: 'NOVA Compliance-Warnung',
        body: message,
        tag: 'compliance-alert',
        requireInteraction: true,
        silent: false,
      });
    },
    [showNotification]
  );

  const notifyIncidentAlert = useCallback(
    (severity: 'low' | 'medium' | 'high' | 'critical', message: string) => {
      const titles = {
        low: 'Neuer Vorfall (Niedrig)',
        medium: 'Neuer Vorfall (Mittel)',
        high: '⚠️ Neuer Vorfall (Hoch)',
        critical: '🚨 Kritischer Vorfall!',
      };

      showNotification({
        title: titles[severity],
        body: message,
        tag: 'incident-alert',
        requireInteraction: severity === 'critical' || severity === 'high',
      });
    },
    [showNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyComplianceAlert,
    notifyIncidentAlert,
  };
}

/**
 * Hook für Notification Permission auf Welcome Page
 */
export function useWelcomeNotificationPrompt() {
  const { isSupported, permission, requestPermission } = useNotifications();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Zeige Prompt beim ersten Login, wenn Permissions noch nicht entschieden
    const hasPrompted = localStorage.getItem('nova_notification_prompted');
    
    if (isSupported && permission === 'default' && !hasPrompted) {
      // Warte 2 Sekunden, dann zeige Prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleAccept = async () => {
    const granted = await requestPermission();
    localStorage.setItem('nova_notification_prompted', granted ? 'granted' : 'denied');
    setShowPrompt(false);

    if (granted) {
      // Zeige Test-Benachrichtigung
      new Notification('NOVA Benachrichtigungen aktiviert', {
        body: 'Sie erhalten jetzt wichtige Updates zu Compliance und Datenschutz.',
        icon: '/nova_logo_hexagon.png',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('nova_notification_prompted', 'declined');
    setShowPrompt(false);
  };

  return {
    showPrompt,
    handleAccept,
    handleDecline,
  };
}
