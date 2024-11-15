import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import {
	updateFilters,
	clearArticlesCache,
	fetchArticles,
	clearFilters,
} from "store/slices/newsSlice";
import { useAppDispatch } from "store/store";
import "./filterPanel.scss";
import { Article } from "api/types";

const CATEGORIES = [
	"Business",
	"Technology",
	"Sports",
	"Science",
	"Health",
	"Entertainment",
];

const SOURCES = ["NewsAPI", "The Guardian", "New York Times"];

const FilterPanel: React.FC = () => {
	const dispatch = useAppDispatch();
	const filters = useSelector((state: RootState) => state.news.filters);

	// Get all articles, including the cached ones
	const allArticles = useSelector((state: RootState) => {
		const cachedArticles = Object.values(state.news.articles).flat();
		// Store initial articles in ref to maintain the full author list
		return cachedArticles;
	});

	// Keep track of initial articles to maintain full author list
	const initialArticles = React.useRef<Article[]>([]);
	React.useEffect(() => {
		if (allArticles.length > 0 && initialArticles.current.length === 0) {
			initialArticles.current = allArticles;
		}
	}, [allArticles]);

	// Get unique authors from initial articles load
	const uniqueAuthors = React.useMemo(() => {
		const articles =
			initialArticles.current.length > 0
				? initialArticles.current
				: allArticles;
		const authors = articles
			.map((article) => article.author)
			.filter((author): author is string => !!author); // Filter out undefined/null
		return Array.from(new Set(authors)).sort();
	}, [allArticles, initialArticles.current]);

	const handleCategoryChange = async (category: string) => {
		const updatedCategories = filters.categories.includes(category)
			? filters.categories.filter((c) => c !== category)
			: [...filters.categories, category];

		dispatch(clearArticlesCache());
		dispatch(updateFilters({ categories: updatedCategories }));
		await dispatch(fetchArticles());
	};

	const handleSourceChange = async (source: string) => {
		const updatedSources = filters.sources.includes(source)
			? filters.sources.filter((s) => s !== source)
			: [...filters.sources, source];

		if (updatedSources.length === 0) {
			return;
		}

		dispatch(clearArticlesCache());
		dispatch(updateFilters({ sources: updatedSources }));
		await dispatch(fetchArticles());
	};

	const handleResetFilters = async () => {
		dispatch(clearArticlesCache());
		dispatch(clearFilters());
		await dispatch(fetchArticles());
	};

	const handleAuthorChange = async (author: string) => {
		const updatedAuthors = filters.authors.includes(author)
			? filters.authors.filter((a) => a !== author)
			: [...filters.authors, author];

		dispatch(clearArticlesCache());
		dispatch(updateFilters({ authors: updatedAuthors }));
		await dispatch(fetchArticles());
	};

	return (
		<div className="filter-panel">
			<div className="filter-header">
				<h2>Filters</h2>
				<button
					className="reset-button"
					onClick={handleResetFilters}
					disabled={
						filters.categories.length === 0 &&
						filters.sources.length === 1 &&
						filters.authors.length === 0
					}
				>
					Reset
				</button>
			</div>

			<section className="filter-section">
				<h3>Categories</h3>
				{CATEGORIES.map((category) => (
					<label key={category} className="filter-option">
						<input
							type="checkbox"
							checked={filters.categories.includes(category)}
							onChange={() => handleCategoryChange(category)}
						/>
						<span>{category}</span>
					</label>
				))}
			</section>

			<section className="filter-section">
				<h3>Sources</h3>
				{SOURCES.map((source) => (
					<label key={source} className="filter-option">
						<input
							type="checkbox"
							checked={filters.sources.includes(source)}
							onChange={() => handleSourceChange(source)}
						/>
						<span>{source}</span>
					</label>
				))}
			</section>

			<section className="filter-section">
				<h3>Authors</h3>
				{uniqueAuthors.length > 0 ? (
					uniqueAuthors.map((author) => (
						<label key={author} className="filter-option">
							<input
								type="checkbox"
								checked={filters.authors.includes(author)}
								onChange={() => handleAuthorChange(author)}
							/>
							<span>{author}</span>
						</label>
					))
				) : (
					<p className="no-filters">
						No authors available for current articles
					</p>
				)}
			</section>
		</div>
	);
};

export default FilterPanel;
