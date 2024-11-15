import axios from 'axios';
import { NewsAPIResponse, GuardianResponse, NYTimesResponse } from './types';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.REACT_APP_GUARDIAN_API_KEY;
const NYTIMES_API_KEY = process.env.REACT_APP_NYTIMES_API_KEY;

export const fetchNewsAPIArticles = async (query: string) => {
   try {
      const response = await axios.get<NewsAPIResponse>(
         `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`
      );

      return response.data.articles.map(article => ({
         id: article.url,
         title: article.title,
         description: article.description,
         source: article.source.name,
         author: article.author,
         publishedAt: article.publishedAt,
         url: article.url,
         imageUrl: article.urlToImage
      }));
   } catch (error) {
      throw new Error('Failed to fetch from NewsAPI');
   }
};

export const fetchGuardianArticles = async (query: string) => {
   try {
      const response = await axios.get<GuardianResponse>(
         `https://content.guardianapis.com/search?q=${query}&api-key=${GUARDIAN_API_KEY}&show-fields=thumbnail,bodyText`
      );

      return response.data.response.results.map(article => ({
         id: article.id,
         title: article.webTitle,
         description: article.fields?.bodyText?.substring(0, 200) || '',
         source: 'The Guardian',
         publishedAt: article.webPublicationDate,
         url: article.webUrl,
         imageUrl: article.fields?.thumbnail
      }));
   } catch (error) {
      throw new Error('Failed to fetch from Guardian API');
   }
};

export const fetchNYTimesArticles = async (query: string) => {
   try {
      const response = await axios.get<NYTimesResponse>(
         `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${NYTIMES_API_KEY}`
      );

      return response.data.response.docs.map(article => ({
         id: article.web_url,
         title: article.headline.main,
         description: article.abstract,
         source: 'New York Times',
         author: article.byline.original,
         publishedAt: article.pub_date,
         url: article.web_url,
         imageUrl: article.multimedia[0]?.url ? `https://www.nytimes.com/${article.multimedia[0].url}` : undefined
      }));
   } catch (error) {
      throw new Error('Failed to fetch from NY Times API');
   }
};