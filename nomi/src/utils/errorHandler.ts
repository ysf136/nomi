import { logEvent } from "./logger";

/**
 * Zentrales Error Handling für NOVA
 * Bietet konsistente Fehlerbehandlung und -logging
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  timestamp: Date;
}

/**
 * Erstellt ein strukturiertes Error-Objekt
 */
export function createError(
  message: string,
  code?: string,
  statusCode?: number,
  details?: unknown
): AppError {
  return {
    message,
    code,
    statusCode,
    details,
    timestamp: new Date(),
  };
}

/**
 * Loggt Errors in die Console (in Production würde dies zu einem Service gehen)
 */
export function logError(error: AppError | Error | unknown): void {
  if (error instanceof Error) {
    console.error('[NOVA Error]:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    logEvent("error", {
      message: error.message,
      stack: error.stack,
    });
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    console.error('[NOVA Error]:', error);
    logEvent("error", error as Record<string, unknown>);
  } else {
    console.error('[NOVA Error]:', {
      error,
      timestamp: new Date().toISOString(),
    });
    logEvent("error", { error });
  }

  // TODO: In Production zu Error-Tracking-Service senden (z.B. Sentry)
  // sendToErrorTrackingService(error);
}

/**
 * Behandelt Firebase-Fehler und gibt benutzerfreundliche Nachrichten zurück
 */
export function handleFirebaseError(error: { code?: string; message: string }): string {
  const errorCode = error.code || '';

  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Ungültige E-Mail-Adresse.';
    case 'auth/user-disabled':
      return 'Dieser Account wurde deaktiviert.';
    case 'auth/user-not-found':
      return 'Kein Account mit dieser E-Mail gefunden.';
    case 'auth/wrong-password':
      return 'Falsches Passwort.';
    case 'auth/email-already-in-use':
      return 'Diese E-Mail-Adresse wird bereits verwendet.';
    case 'auth/weak-password':
      return 'Passwort ist zu schwach. Mindestens 6 Zeichen erforderlich.';
    case 'auth/network-request-failed':
      return 'Netzwerkfehler. Bitte Internetverbindung prüfen.';
    case 'auth/too-many-requests':
      return 'Zu viele Anfragen. Bitte später erneut versuchen.';
    case 'permission-denied':
      return 'Keine Berechtigung für diese Aktion.';
    case 'not-found':
      return 'Ressource nicht gefunden.';
    case 'unavailable':
      return 'Service vorübergehend nicht verfügbar.';
    default:
      logError(error);
      return 'Ein unerwarteter Fehler ist aufgetreten.';
  }
}

/**
 * Behandelt API-Fehler von externen Services
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    logError(error);
    return error.message || 'API-Fehler aufgetreten.';
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const apiError = error as { message: string; statusCode?: number };
    logError(apiError);

    if (apiError.statusCode === 404) return 'Ressource nicht gefunden.';
    if (apiError.statusCode === 401) return 'Nicht autorisiert.';
    if (apiError.statusCode === 403) return 'Zugriff verweigert.';
    if (apiError.statusCode === 500) return 'Serverfehler.';

    return apiError.message;
  }

  logError(error);
  return 'Ein unbekannter Fehler ist aufgetreten.';
}

/**
 * Wrapper für async Funktionen mit Error Handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage = 'Operation fehlgeschlagen'
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : errorMessage;
    logError(err);
    return { data: null, error };
  }
}

/**
 * Validiert erforderliche Environment Variables
 */
export function validateEnvVars(): void {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    const error = createError(
      `Fehlende Environment Variables: ${missing.join(', ')}`,
      'ENV_VARS_MISSING',
      500
    );
    logError(error);
    throw new Error(error.message);
  }
}
