export interface Article {
   id: string;
   title: string;
   description: string;
   source: string;
   author?: string;
   publishedAt: string;
   url: string;
   category?: string;
   imageUrl?: string;
}

export interface NewsSource {
   id: string;
   name: string;
   enabled: boolean;
}

export interface NewsFilters {
   searchQuery: string;
   startDate?: string;
   endDate?: string;
   categories: string[];
   sources: string[];
   authors: string[];
}

export interface UserPreferences {
   preferredSources: string[];
   preferredCategories: string[];
   preferredAuthors: string[];
}

export interface NewsAPIResponse {
   status: string;
   totalResults: number;
   articles: Array<{
      source: {
         id: string | null;
         name: string;
      };
      author: string | null;
      title: string;
      description: string;
      url: string;
      urlToImage: string | null;
      publishedAt: string;
      content: string;
   }>;
}

export interface GuardianResponse {
   response: {
      status: string;
      total: number;
      results: Array<{
         id: string;
         type: string;
         sectionId: string;
         sectionName: string;
         webPublicationDate: string;
         webTitle: string;
         webUrl: string;
         apiUrl: string;
         fields?: {
            thumbnail?: string;
            bodyText?: string;
         };
      }>;
   };
}

export interface NYTimesResponse {
   status: string;
   response: {
      docs: Array<{
         abstract: string;
         web_url: string;
         snippet: string;
         lead_paragraph: string;
         source: string;
         multimedia: Array<{
            url: string;
            type: string;
         }>;
         headline: {
            main: string;
         };
         pub_date: string;
         byline: {
            original: string | null;
         };
      }>;
   };
}

export interface APIErrorResponse {
   status: string;
   code?: string;
   message: string;
}

export type NewsAPISource = 'newsapi' | 'guardian' | 'nytimes';

export interface FetchNewsOptions extends NewsFilters {
   source?: NewsAPISource;
   page?: number;
   pageSize?: number;
}