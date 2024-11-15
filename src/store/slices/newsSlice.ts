import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, NewsFilters } from '../../api/types';

interface NewsState {
   articles: Article[];
   loading: boolean;
   error: string | null;
   filters: NewsFilters;
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
      sources: [],
      authors: []
   }
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
      }
   }
});

export const {
   setArticles,
   setLoading,
   setError,
   updateFilters,
   clearFilters
} = newsSlice.actions;

export default newsSlice.reducer;