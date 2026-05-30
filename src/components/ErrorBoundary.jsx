import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app-fallback">
          <img src="/netflux-logo.png" alt="" width="56" height="56" />
          <h1>App failed to load</h1>
          <p>{this.state.error.message}</p>
          <p>
            Run <code>npm run dev</code> and open{' '}
            <code>http://localhost:5173</code>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
