import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./styles/main.scss";

const metaThemeColor = document.querySelector('meta[name="theme-color"]');
if (metaThemeColor) {
	const theme = localStorage.getItem("theme") || "light";
	metaThemeColor.setAttribute(
		"content",
		theme === "light" ? "#ffffff" : "#1a1a1a"
	);
}

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
