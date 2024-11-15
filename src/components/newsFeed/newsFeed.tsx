import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { changePage } from "../../store/slices/newsSlice";
import ArticleCard from "../articleCard/articleCard";
import "./newsFeed.scss";
import { useAppDispatch } from "../../store/store";

const NewsFeed: React.FC = () => {
	const dispatch = useAppDispatch();
	const { articles, loading, currentPage, hasMore } = useSelector(
		(state: RootState) => state.news
	);

	if (articles.length === 0) {
		return (
			<div className="no-articles">
				<p>No articles found. Try adjusting your filters or search terms.</p>
			</div>
		);
	}

	const handlePrevPage = async () => {
		if (currentPage > 1 && !loading) {
			await dispatch(changePage(currentPage - 1));
		}
	};

	const handleNextPage = async () => {
		if (hasMore && !loading) {
			await dispatch(changePage(currentPage + 1));
		}
	};

	return (
		<div className="news-feed">
			<div className="articles-grid">
				{articles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}
			</div>

			<div className="pagination">
				<button
					onClick={handlePrevPage}
					disabled={currentPage === 1 || loading}
					className="pagination-button"
				>
					Previous
				</button>
				<span className="page-number">Page {currentPage}</span>
				<button
					onClick={handleNextPage}
					disabled={!hasMore || loading}
					className="pagination-button"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default NewsFeed;
