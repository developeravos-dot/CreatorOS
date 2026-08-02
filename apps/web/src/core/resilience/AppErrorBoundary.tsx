import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(
    error: Error,
  ): AppErrorBoundaryState {
    return {
      error,
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo,
  ): void {
    console.error(
      "[CreatorOS Error Boundary]",
      {
        error,
        componentStack:
          info.componentStack,
      },
    );
  }

  private resetApplication =
    (): void => {
      this.setState({
        error: null,
      });
    };

  private reloadApplication =
    (): void => {
      window.location.reload();
    };

  render(): ReactNode {
    const { error } =
      this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <main
        className="creatoros-error-boundary"
        role="alert"
      >
        <section>
          <span>
            CREATOROS RECOVERY
          </span>

          <h1>
            حدث خطأ غير متوقع
          </h1>

          <p>
            تم إيقاف الجزء المتعطل لمنع
            تأثيره على بقية النظام.
          </p>

          <details>
            <summary>
              التفاصيل التقنية
            </summary>

            <pre>
              {error.message}
            </pre>
          </details>

          <div>
            <button
              type="button"
              onClick={
                this.resetApplication
              }
            >
              المحاولة مجددًا
            </button>

            <button
              type="button"
              onClick={
                this.reloadApplication
              }
            >
              إعادة تحميل النظام
            </button>
          </div>
        </section>
      </main>
    );
  }
}
