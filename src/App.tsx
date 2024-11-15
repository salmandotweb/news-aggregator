import React from "react";
import { usePreferences } from "./hooks/usePreferences";
import SearchBar from "./components/searchBar/searchBar";
import FilterPanel from "./components/filterPanel/filterPanel";
import NewsFeed from "./components/newsFeed/newsFeed";
import ErrorBoundary from "./components/errorBoundary";
import LoadingSpinner from "./components/loadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import "./styles/main.scss";

const App: React.FC = () => {
	const { theme } = usePreferences();
	const { loading, error } = useSelector((state: RootState) => state.news);

	return (
		<div className={`app ${theme}`}>
			<header className="app-header">
				<div className="header-content">
					<h1>News Aggregator</h1>
					<SearchBar />
				</div>
			</header>

			<main className="app-main">
				<ErrorBoundary>
					<aside className="app-sidebar">
						<FilterPanel />
					</aside>

					<section className="app-content">
						{error && <div className="error-message">{error}</div>}

						{loading ? <LoadingSpinner /> : <NewsFeed />}
					</section>
				</ErrorBoundary>
			</main>
		</div>
	);
};

export default App;
