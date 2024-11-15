import React from "react";
import "./loadingSpinner.scss";

const LoadingSpinner: React.FC = () => (
	<div className="loading-spinner-container">
		<div className="loading-spinner">
			<div className="spinner"></div>
			<p>Loading articles...</p>
		</div>
	</div>
);

export default LoadingSpinner;
