import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, NewsFilters } from '../../api/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
   fetchNewsAPIArticles,
   fetchGuardianArticles,
   fetchNYTimesArticles
} from '../../api/newsServices';
import { RootState } from 'store/store';

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
      sources: ['NewsAPI'],
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

export const fetchArticles = createAsyncThunk(
   'news/fetchArticles',
   async (_, { getState, rejectWithValue }) => {
      try {
         const { news } = getState() as RootState;
         const { searchQuery, sources } = news.filters;

         const query = searchQuery || 'latest news';

         const promises = [];

         if (sources.includes('NewsAPI')) {
            promises.push(fetchNewsAPIArticles(query));
         }
         if (sources.includes('The Guardian')) {
            promises.push(fetchGuardianArticles(query));
         }
         if (sources.includes('New York Times')) {
            promises.push(fetchNYTimesArticles(query));
         }

         const results = await Promise.all(promises);
         return results.flat();
      } catch (error) {
         return rejectWithValue((error as Error).message);
      }
   }
);

export default newsSlice.reducer;