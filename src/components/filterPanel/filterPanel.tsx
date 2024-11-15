import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import {
	updateFilters,
	clearArticlesCache,
	fetchArticles,
} from "store/slices/newsSlice";
import { useAppDispatch } from "store/store";
import "./filterPanel.scss";

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

	const handleCategoryChange = async (category: string) => {
		const updatedCategories = filters.categories.includes(category)
			? filters.categories.filter((c) => c !== category)
			: [category];

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

	return (
		<div className="filter-panel">
			<h2>Filters</h2>

			<section className="filter-section">
				<h3>Categories</h3>
				{CATEGORIES.map((category) => (
					<label key={category} className="filter-option">
						<input
							type="checkbox"
							checked={filters.categories.includes(category)}
							onChange={() => handleCategoryChange(category)}
						/>
						{category}
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
						{source}
					</label>
				))}
			</section>
		</div>
	);
};

export default FilterPanel;
