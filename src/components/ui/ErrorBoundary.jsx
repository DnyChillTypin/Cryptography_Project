import React from 'react';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-neon-magenta mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Math Computation Error</h2>
          <p className="text-sm text-text-secondary max-w-md bg-black/30 p-4 rounded-lg font-mono">
            {this.state.error?.message || "An impossible mathematical configuration was entered."}
          </p>
          <button 
            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/10"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reset Solver
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
