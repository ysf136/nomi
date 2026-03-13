import React, { Component, ReactNode, ErrorInfo } from 'react';
import { tokens } from '../../styles/tokens';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component zum Abfangen von React Component Errors
 * Verhindert, dass die gesamte App crasht bei Component-Fehlern
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Error-Logging-Service (z.B. Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Benutzerdefiniertes Fallback oder Standard-Error-UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
          }}
        >
          <div
            className="nova-glass-static"
            style={{
              borderRadius: 16,
              padding: '2rem',
              maxWidth: 600,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ color: tokens.colors.neutral[900], marginBottom: '1rem', fontSize: 24 }}>
              Etwas ist schiefgelaufen
            </h1>
            <p style={{ color: tokens.colors.neutral[500], marginBottom: '1.5rem' }}>
              Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie, die Seite neu zu laden.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginBottom: '1.5rem' }}>
                <summary
                  style={{
                    cursor: 'pointer',
                    color: tokens.colors.brand.primary,
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  Fehlerdetails (Development Mode)
                </summary>
                <pre
                  style={{
                    background: '#F3F4F6',
                    padding: '1rem',
                    borderRadius: 8,
                    overflow: 'auto',
                    fontSize: 12,
                    color: '#EF4444',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={this.handleReset}
                className="nova-btn nova-btn-primary"
              >
                Erneut versuchen
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="nova-btn nova-btn-secondary"
              >
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
