import React from "react";
import { Article } from "api/types";
import { format } from "date-fns";
import "./articleCard.scss";

interface ArticleCardProps {
	article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
	return (
		<article className="article-card">
			{article.imageUrl && (
				<img
					src={article.imageUrl}
					alt={article.title}
					className="article-image"
				/>
			)}
			<div className="article-content">
				<div className="article-header">
					<h2 className="article-title">
						<a href={article.url} target="_blank" rel="noopener noreferrer">
							{article.title}
						</a>
					</h2>
					<span className="article-source">{article.source}</span>
				</div>
				<p className="article-meta">
					{format(new Date(article.publishedAt), "MMM d, yyyy")}
					{article.author && ` • By ${article.author}`}
				</p>
				<p className="article-description">{article.description}</p>
			</div>
		</article>
	);
};

export default ArticleCard;
