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
   articles: { [page: number]: Article[] };
   loading: boolean;
   error: string | null;
   filters: NewsFilters;
   currentPage: number;
   totalResults: number;
   hasMore: boolean;
}

const initialState: NewsState = {
   articles: {},
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
      setArticles(state, action: PayloadAction<{ page: number; articles: Article[] }>) {
         state.articles[action.payload.page] = action.payload.articles;
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
      },
      clearArticlesCache(state) {
         state.articles = {};
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
   setHasMore,
   clearArticlesCache
} = newsSlice.actions;

export const updateSource = createAsyncThunk(
   'news/updateSource',
   async (sources: string[], { dispatch }) => {
      dispatch(clearArticlesCache());
      dispatch(setCurrentPage(1));
      dispatch(updateFilters({ sources }));
      return dispatch(fetchArticles()).unwrap();
   }
);

export const fetchArticles = createAsyncThunk(
   'news/fetchArticles',
   async (_, { getState, dispatch }) => {
      try {
         const { news } = getState() as RootState;
         const { currentPage } = news;

         if (news.articles[currentPage]?.length > 0) {
            return news.articles[currentPage];
         }

         if (news.loading) {
            return;
         }

         dispatch(setLoading(true));
         dispatch(setError(null));

         const { searchQuery, sources, categories } = news.filters;
         let articles: Article[] = [];
         let totalResults = 0;

         const selectedCategory = categories.length > 0 ? categories[categories.length - 1].toLowerCase() : undefined;

         if (sources.includes('NewsAPI')) {
            const newsAPIResult = await fetchNewsAPIArticles(
               searchQuery,
               currentPage,
               selectedCategory
            );
            articles = newsAPIResult.articles;
            totalResults = newsAPIResult.totalResults;
         }

         if (sources.includes('The Guardian')) {
            const guardianResult = await fetchGuardianArticles(
               searchQuery,
               currentPage,
               selectedCategory
            );
            articles = sources.includes('NewsAPI')
               ? [...articles, ...guardianResult.articles]
               : guardianResult.articles;
            if (!sources.includes('NewsAPI')) {
               totalResults = guardianResult.totalResults;
            }
         }

         if (sources.includes('New York Times')) {
            const nyTimesArticles = await fetchNYTimesArticles(
               searchQuery,
               selectedCategory,
               currentPage
            );
            articles = sources.includes('NewsAPI') || sources.includes('The Guardian')
               ? [...articles, ...nyTimesArticles.articles]
               : nyTimesArticles.articles;

            if (!sources.includes('NewsAPI') && !sources.includes('The Guardian')) {
               totalResults = nyTimesArticles.totalResults;
            }
         }

         if (categories.length > 0) {
            articles = articles.filter(article =>
               article.category && categories.some(cat =>
                  cat.toLowerCase() === article.category?.toLowerCase()
               )
            );
         }

         if (articles.length === 0) {
            dispatch(setHasMore(false));
            dispatch(setLoading(false));
            return [];
         }

         const hasMoreArticles = sources.includes('NewsAPI') || sources.includes('The Guardian')
            ? currentPage * ARTICLES_PER_PAGE < totalResults
            : sources.includes('New York Times')
               ? currentPage * ARTICLES_PER_PAGE < totalResults
               : false;

         dispatch(setHasMore(hasMoreArticles));
         dispatch(setArticles({ page: currentPage, articles }));
         dispatch(setTotalResults(totalResults));
         dispatch(setLoading(false));

         return articles;
      } catch (error) {
         dispatch(setLoading(false));
         throw error;
      }
   }
);

export const changePage = createAsyncThunk(
   'news/changePage',
   async (page: number, { dispatch, getState }) => {
      const { news } = getState() as RootState;

      if (page > news.currentPage && !news.hasMore) {
         return;
      }

      dispatch(setCurrentPage(page));
      return dispatch(fetchArticles()).unwrap();
   }
);

export default newsSlice.reducer;