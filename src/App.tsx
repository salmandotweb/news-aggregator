import React, { useEffect, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { fetchArticles } from "./store/slices/newsSlice";
import { usePreferences } from "./hooks/usePreferences";
import SearchBar from "./components/searchBar/searchBar";
import ErrorBoundary from "./components/errorBoundary";
import LoadingSpinner from "./components/loadingSpinner";
import { RootState } from "./store/store";
import { useAppDispatch } from "./store/store";
import "./styles/main.scss";

const NewsFeed = lazy(() => import("./components/newsFeed/newsFeed"));
const FilterPanel = lazy(() => import("./components/filterPanel/filterPanel"));

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const { theme, toggleTheme } = usePreferences();
	const { loading, error } = useSelector((state: RootState) => state.news);

	useEffect(() => {
		const controller = new AbortController();
		dispatch(fetchArticles());
		return () => controller.abort();
	}, [dispatch]);

	return (
		<div className={`app ${theme}`}>
			<header className="app-header">
				<div className="header-content">
					<div className="brand">
						<h1>
							News<span>Aggregator</span>
						</h1>

						<button
							className="theme-toggle"
							onClick={toggleTheme}
							aria-label="Toggle theme"
						>
							{theme === "light" ? "🌙" : "☀️"}
						</button>
					</div>

					<SearchBar />
				</div>
			</header>

			<main className="app-main">
				<ErrorBoundary>
					<Suspense fallback={<LoadingSpinner />}>
						<aside className="app-sidebar">
							<FilterPanel />
						</aside>
						<section className="app-content">
							{error && <div className="error-message">{error}</div>}
							{loading ? <LoadingSpinner /> : <NewsFeed />}
						</section>
					</Suspense>
				</ErrorBoundary>
			</main>
		</div>
	);
};

export default App;
