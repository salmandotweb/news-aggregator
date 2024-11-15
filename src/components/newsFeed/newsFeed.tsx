import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ArticleCard from "../articleCard/articleCard";
import "./newsFeed.scss";

const NewsFeed: React.FC = () => {
	const { articles } = useSelector((state: RootState) => state.news);

	if (articles.length === 0) {
		return (
			<div className="no-articles">
				<p>No articles found. Try adjusting your filters or search terms.</p>
			</div>
		);
	}

	return (
		<div className="news-feed">
			{articles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	);
};

export default NewsFeed;
