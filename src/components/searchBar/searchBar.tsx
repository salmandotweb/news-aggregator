import React, { useState } from "react";
import {
	updateFilters,
	clearArticlesCache,
	fetchArticles,
} from "store/slices/newsSlice";
import { useAppDispatch } from "store/store";
import "./searchBar.scss";

const SearchBar: React.FC = () => {
	const dispatch = useAppDispatch();
	const [searchValue, setSearchValue] = useState("");

	const handleSearch = async () => {
		dispatch(clearArticlesCache());
		dispatch(updateFilters({ searchQuery: searchValue }));
		await dispatch(fetchArticles());
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="search-bar">
			<div className="search-input-wrapper">
				<input
					type="text"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Search news..."
					className="search-input"
				/>
				<button
					className="search-button"
					onClick={handleSearch}
					aria-label="Search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
