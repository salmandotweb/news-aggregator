import axios from 'axios';
import { NewsAPIResponse, GuardianResponse, NYTimesResponse, Article } from './types';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.REACT_APP_GUARDIAN_API_KEY;
const NYTIMES_API_KEY = process.env.REACT_APP_NYTIMES_API_KEY;

export const ARTICLES_PER_PAGE = 10;

export interface NewsAPIResult {
   articles: Article[];
   totalResults: number;
}

export const fetchNewsAPIArticles = async (query: string, page = 1): Promise<NewsAPIResult> => {
   try {
      const endpoint = query
         ? `https://newsapi.org/v2/everything?q=${query}&pageSize=${ARTICLES_PER_PAGE}&page=${page}&apiKey=${NEWS_API_KEY}`
         : `https://newsapi.org/v2/top-headlines?country=us&pageSize=${ARTICLES_PER_PAGE}&page=${page}&apiKey=${NEWS_API_KEY}`;

      const response = await axios.get<NewsAPIResponse>(endpoint);

      const filteredArticles = response.data.articles
         .filter(article =>
            article.title &&
            article.title !== '[Removed]' &&
            article.description &&
            article.description !== '[Removed]'
         )
         .map(article => ({
            id: article.url,
            title: article.title,
            description: article.description || '',
            source: article.source.name,
            author: article.author || undefined,
            publishedAt: article.publishedAt,
            url: article.url,
            imageUrl: article.urlToImage || undefined,
            category: undefined
         }));

      return {
         articles: filteredArticles,
         totalResults: response.data.totalResults
      };
   } catch (error) {
      console.error('NewsAPI Error:', error);
      throw new Error('Failed to fetch from NewsAPI');
   }
};

export const fetchGuardianArticles = async (query: string): Promise<Article[]> => {
   try {
      const response = await axios.get<GuardianResponse>(
         `https://content.guardianapis.com/search?q=${query}&api-key=${GUARDIAN_API_KEY}&show-fields=thumbnail,bodyText`
      );

      return response.data.response.results.map(article => ({
         id: article.id,
         title: article.webTitle,
         description: article.fields?.bodyText?.substring(0, 200) || '',
         source: 'The Guardian',
         author: undefined,
         publishedAt: article.webPublicationDate,
         url: article.webUrl,
         imageUrl: article.fields?.thumbnail,
         category: undefined
      }));
   } catch (error) {
      throw new Error('Failed to fetch from Guardian API');
   }
};

export const fetchNYTimesArticles = async (query: string): Promise<Article[]> => {
   try {
      const response = await axios.get<NYTimesResponse>(
         `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${NYTIMES_API_KEY}`
      );

      return response.data.response.docs.map(article => ({
         id: article.web_url,
         title: article.headline.main,
         description: article.abstract || '',
         source: 'New York Times',
         author: article.byline?.original || undefined,
         publishedAt: article.pub_date,
         url: article.web_url,
         imageUrl: article.multimedia?.[0]?.url
            ? `https://www.nytimes.com/${article.multimedia[0].url}`
            : undefined,
         category: undefined
      }));
   } catch (error) {
      throw new Error('Failed to fetch from NY Times API');
   }
};