import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { updateFilters } from "store/slices/newsSlice";
import "./searchBar.scss";

const SearchBar: React.FC = () => {
	const dispatch = useDispatch();
	const [searchValue, setSearchValue] = useState("");

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			dispatch(updateFilters({ searchQuery: value }));
		}, 500),
		[dispatch]
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);
		debouncedSearch(value);
	};

	return (
		<div className="search-bar">
			<input
				type="text"
				value={searchValue}
				onChange={handleChange}
				placeholder="Search news..."
				className="search-input"
			/>
		</div>
	);
};

export default SearchBar;
