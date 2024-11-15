import { Component, ErrorInfo, ReactNode } from "react";
import "./errorBoundary.scss";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className="error-boundary">
					<h2>Something went wrong</h2>
					<p>{this.state.error?.message}</p>
					<button
						onClick={() => window.location.reload()}
						className="error-button"
					>
						Refresh Page
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
