import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

interface DashboardErrorBoundaryProps {
  children: ReactNode;
}

interface DashboardErrorBoundaryState {
  error: Error | null;
}

export default class DashboardErrorBoundary extends Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  state:
    DashboardErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(
    error: Error,
  ): DashboardErrorBoundaryState {
    return {
      error,
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo,
  ): void {
    console.error(
      "[CreatorOS:DashboardErrorBoundary]",
      error,
      info,
    );
  }

  private reset = (): void => {
    this.setState({
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <section
          className="dashboard-enterprise-error-boundary"
          role="alert"
        >
          <div>
            <span>
              Dashboard recovery
            </span>

            <h2>
              Dashboard 2.0 encountered an error
            </h2>

            <p>
              The dashboard section failed safely without affecting the rest of CreatorOS.
            </p>
          </div>

          <button
            type="button"
            onClick={this.reset}
          >
            Retry dashboard
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
