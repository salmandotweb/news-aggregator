import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { updateFilters, clearArticlesCache } from "store/slices/newsSlice";
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
	const dispatch = useDispatch();
	const filters = useSelector((state: RootState) => state.news.filters);

	const handleCategoryChange = (category: string) => {
		const updatedCategories = filters.categories.includes(category)
			? filters.categories.filter((c) => c !== category)
			: [...filters.categories, category];

		dispatch(clearArticlesCache());
		dispatch(updateFilters({ categories: updatedCategories }));
	};

	const handleSourceChange = (source: string) => {
		const updatedSources = filters.sources.includes(source)
			? filters.sources.filter((s) => s !== source)
			: [...filters.sources, source];

		dispatch(clearArticlesCache());
		dispatch(updateFilters({ sources: updatedSources }));
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
