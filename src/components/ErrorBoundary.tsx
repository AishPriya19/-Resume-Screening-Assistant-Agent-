import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }): void {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen grid place-items-center px-6">
          <div className="card p-8 max-w-md text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-miss/15 grid place-items-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-miss" />
            </div>
            <h1 className="font-display text-xl font-semibold">Something broke in the UI</h1>
            <p className="text-sm text-ink-muted">{this.state.error.message}</p>
            <button onClick={() => location.reload()} className="btn-outline mx-auto">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
