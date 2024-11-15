import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, NewsFilters } from '../../api/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
   fetchNewsAPIArticles,
   fetchGuardianArticles,
   fetchNYTimesArticles,
   ARTICLES_PER_PAGE
} from '../../api/newsServices';
import { RootState } from 'store/store';

interface NewsState {
   articles: Article[];
   loading: boolean;
   error: string | null;
   filters: NewsFilters;
   currentPage: number;
   totalResults: number;
   hasMore: boolean;
}

const initialState: NewsState = {
   articles: [],
   loading: false,
   error: null,
   filters: {
      searchQuery: '',
      startDate: undefined,
      endDate: undefined,
      categories: [],
      sources: ['NewsAPI'],
      authors: []
   },
   currentPage: 1,
   totalResults: 0,
   hasMore: true
};

const newsSlice = createSlice({
   name: 'news',
   initialState,
   reducers: {
      setArticles(state, action: PayloadAction<Article[]>) {
         state.articles = action.payload;
      },
      setLoading(state, action: PayloadAction<boolean>) {
         state.loading = action.payload;
      },
      setError(state, action: PayloadAction<string | null>) {
         state.error = action.payload;
      },
      updateFilters(state, action: PayloadAction<Partial<NewsFilters>>) {
         state.filters = { ...state.filters, ...action.payload };
      },
      clearFilters(state) {
         state.filters = initialState.filters;
      },
      setCurrentPage(state, action: PayloadAction<number>) {
         state.currentPage = action.payload;
      },
      setTotalResults(state, action: PayloadAction<number>) {
         state.totalResults = action.payload;
      },
      setHasMore(state, action: PayloadAction<boolean>) {
         state.hasMore = action.payload;
      }
   }
});

export const {
   setArticles,
   setLoading,
   setError,
   updateFilters,
   clearFilters,
   setCurrentPage,
   setTotalResults,
   setHasMore
} = newsSlice.actions;

export const fetchArticles = createAsyncThunk(
   'news/fetchArticles',
   async (_, { getState, dispatch }) => {
      try {
         const { news } = getState() as RootState;

         if (news.loading) {
            return;
         }

         dispatch(setLoading(true));
         dispatch(setError(null));

         const { searchQuery, sources } = news.filters;
         const { currentPage } = news;
         let articles: Article[] = [];
         let totalResults = 0;

         if (sources.includes('NewsAPI')) {
            const newsAPIResult = await fetchNewsAPIArticles(searchQuery, currentPage);
            articles = newsAPIResult.articles;
            totalResults = newsAPIResult.totalResults;

            if (articles.length === 0 && currentPage > 1) {
               dispatch(setCurrentPage(currentPage - 1));
               dispatch(setHasMore(false));
               dispatch(setLoading(false));
               return;
            }

            const hasMoreArticles = currentPage * ARTICLES_PER_PAGE < totalResults;
            dispatch(setHasMore(hasMoreArticles));
         }
         if (sources.includes('The Guardian')) {
            const guardianArticles = await fetchGuardianArticles(searchQuery || 'news');
            articles = [...articles, ...guardianArticles];
         }
         if (sources.includes('New York Times')) {
            const nyTimesArticles = await fetchNYTimesArticles(searchQuery || 'news');
            articles = [...articles, ...nyTimesArticles];
         }

         dispatch(setArticles(articles));
         dispatch(setTotalResults(totalResults));
         dispatch(setLoading(false));

         return articles;
      } catch (error) {
         dispatch(setLoading(false));
         dispatch(setError((error as Error).message));
         throw error;
      }
   }
);

// New action to handle page changes
export const changePage = createAsyncThunk(
   'news/changePage',
   async (page: number, { dispatch, getState }) => {
      const { news } = getState() as RootState;

      // Don't allow going to next page if there are no more results
      if (page > news.currentPage && !news.hasMore) {
         return;
      }

      dispatch(setCurrentPage(page));
      return dispatch(fetchArticles());
   }
);

export default newsSlice.reducer;