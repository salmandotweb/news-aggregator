import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '../../api/types';

interface PreferencesState {
   userPreferences: UserPreferences;
   theme: 'light' | 'dark';
}

const defaultPreferences: UserPreferences = {
   preferredSources: [],
   preferredCategories: [],
   preferredAuthors: []
};

const loadSavedPreferences = (): PreferencesState => {
   try {
      const savedPreferencesString = localStorage.getItem('userPreferences');
      const savedPreferences: UserPreferences = savedPreferencesString
         ? JSON.parse(savedPreferencesString)
         : defaultPreferences;

      const validatedPreferences: UserPreferences = {
         preferredSources: Array.isArray(savedPreferences.preferredSources)
            ? savedPreferences.preferredSources
            : [],
         preferredCategories: Array.isArray(savedPreferences.preferredCategories)
            ? savedPreferences.preferredCategories
            : [],
         preferredAuthors: Array.isArray(savedPreferences.preferredAuthors)
            ? savedPreferences.preferredAuthors
            : []
      };

      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';

      return {
         userPreferences: validatedPreferences,
         theme: savedTheme || 'light'
      };
   } catch (error) {
      // If there's any error parsing the saved preferences, return defaults
      return {
         userPreferences: defaultPreferences,
         theme: 'light'
      };
   }
};

const initialState: PreferencesState = loadSavedPreferences();

const preferencesSlice = createSlice({
   name: 'preferences',
   initialState,
   reducers: {
      updatePreferences(state, action: PayloadAction<Partial<UserPreferences>>) {
         state.userPreferences = {
            ...state.userPreferences,
            ...action.payload
         };
         localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
      },
      toggleTheme(state) {
         state.theme = state.theme === 'light' ? 'dark' : 'light';
         localStorage.setItem('theme', state.theme);
      },
      addPreferredSource(state, action: PayloadAction<string>) {
         if (!state.userPreferences.preferredSources.includes(action.payload)) {
            state.userPreferences.preferredSources.push(action.payload);
            localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
         }
      },
      removePreferredSource(state, action: PayloadAction<string>) {
         state.userPreferences.preferredSources =
            state.userPreferences.preferredSources.filter(source => source !== action.payload);
         localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
      },
      addPreferredCategory(state, action: PayloadAction<string>) {
         if (!state.userPreferences.preferredCategories.includes(action.payload)) {
            state.userPreferences.preferredCategories.push(action.payload);
            localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
         }
      },
      removePreferredCategory(state, action: PayloadAction<string>) {
         state.userPreferences.preferredCategories =
            state.userPreferences.preferredCategories.filter(category => category !== action.payload);
         localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
      },
      resetPreferences(state) {
         state.userPreferences = defaultPreferences;
         localStorage.removeItem('userPreferences');
      }
   }
});

export const {
   updatePreferences,
   toggleTheme,
   addPreferredSource,
   removePreferredSource,
   addPreferredCategory,
   removePreferredCategory,
   resetPreferences
} = preferencesSlice.actions;

export default preferencesSlice.reducer;