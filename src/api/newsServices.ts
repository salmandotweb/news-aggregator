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

export interface GuardianResult {
   articles: Article[];
   totalResults: number;
}

export const fetchNewsAPIArticles = async (
   query: string,
   page: number,
   category?: string
): Promise<{ articles: Article[]; totalResults: number }> => {
   try {
      const endpoint = query
         ? `https://newsapi.org/v2/everything?q=${query}&pageSize=${ARTICLES_PER_PAGE}&page=${page}&apiKey=${NEWS_API_KEY}`
         : `https://newsapi.org/v2/top-headlines?country=us${category ? `&category=${category}` : ''}&pageSize=${ARTICLES_PER_PAGE}&page=${page}&apiKey=${NEWS_API_KEY}`;

      const response = await axios.get<NewsAPIResponse>(endpoint);

      const filteredArticles = response.data.articles
         .filter(article =>
            article.title &&
            article.title !== '[Removed]' &&
            article.description &&
            article.description !== '[Removed]' &&
            article.urlToImage
         )
         .map(article => ({
            id: article.url,
            title: article.title,
            description: article.description || '',
            source: 'NewsAPI',
            author: article.author && article.author.trim() !== '' ? article.author : undefined,
            publishedAt: article.publishedAt,
            url: article.url,
            imageUrl: article.urlToImage || '',
            category: category ? category.charAt(0).toUpperCase() + category.slice(1) : undefined
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

export const fetchGuardianArticles = async (
   query: string,
   page: number,
   category?: string
): Promise<GuardianResult> => {
   try {
      const endpoint = `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}${category ? `&section=${category}` : ''}&api-key=${GUARDIAN_API_KEY}&show-fields=thumbnail,bodyText,headline,byline&page=${page}&page-size=${ARTICLES_PER_PAGE}&order-by=newest`;

      const response = await axios.get<GuardianResponse>(endpoint);

      if (response.data.response.status !== 'ok') {
         throw new Error('Guardian API response not ok');
      }

      const articles = response.data.response.results
         .filter(article => article.fields?.thumbnail)
         .map(article => ({
            id: article.id,
            title: article.webTitle,
            description: article.fields?.bodyText?.substring(0, 200) || '',
            source: 'The Guardian',
            author: article.fields?.byline || undefined,
            publishedAt: article.webPublicationDate,
            url: article.webUrl,
            imageUrl: article.fields?.thumbnail || '',
            category: article.sectionName
         }));

      return {
         articles,
         totalResults: response.data.response.total
      };
   } catch (error) {
      console.error('Guardian API Error:', error);
      throw new Error('Failed to fetch from Guardian API');
   }
};

export const fetchNYTimesArticles = async (
   query: string,
   category?: string,
   page: number = 1
): Promise<{ articles: Article[], totalResults: number }> => {
   try {
      const endpoint =
         `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(query)}${category ? `&fq=news_desk:(${category})` : ''}&page=${page - 1}&api-key=${NYTIMES_API_KEY}`;

      const response = await axios.get<NYTimesResponse>(endpoint);

      if ('response' in response.data) {
         const articles = response.data.response.docs
            .filter(article => article.multimedia?.[0]?.url)
            .map(article => ({
               id: article.web_url,
               title: article.headline.main,
               description: article.abstract || '',
               source: 'New York Times',
               author: article.byline?.original?.replace('By ', '') || undefined,
               publishedAt: article.pub_date,
               url: article.web_url,
               imageUrl: article.multimedia?.[0]?.url ?
                  `https://www.nytimes.com/${article.multimedia[0].url}` : '',
               category: undefined
            }));

         return {
            articles,
            totalResults: response.data.response.meta?.hits || 0
         };
      }

      return {
         articles: [],
         totalResults: 0
      };
   } catch (error) {
      console.error('NY Times API Error:', error);
      throw new Error('Failed to fetch from NY Times API');
   }
};