import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-espresso flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-card shadow-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="font-serif text-2xl text-heading mb-2">Something went wrong</h1>
            <p className="text-sm text-text-gray mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = "#/";
                window.location.reload();
              }}
              className="btn btn-gold"
            >
              Go Home
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-text-gray cursor-pointer">Details</summary>
                <pre className="mt-2 p-3 bg-cream-50 rounded text-[10px] text-text-gray overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
