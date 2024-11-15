import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { UserPreferences } from '../api/types';
import {
   updatePreferences,
   toggleTheme,
   addPreferredSource,
   removePreferredSource,
   addPreferredCategory,
   removePreferredCategory
} from '../store/slices/preferencesSlice';

export const usePreferences = () => {
   const dispatch = useDispatch();
   const { userPreferences, theme } = useSelector(
      (state: RootState) => state.preferences
   );

   return {
      preferences: userPreferences,
      theme,
      updatePreferences: (preferences: Partial<UserPreferences>) =>
         dispatch(updatePreferences(preferences)),
      toggleTheme: () => dispatch(toggleTheme()),
      addSource: (source: string) => dispatch(addPreferredSource(source)),
      removeSource: (source: string) => dispatch(removePreferredSource(source)),
      addCategory: (category: string) => dispatch(addPreferredCategory(category)),
      removeCategory: (category: string) => dispatch(removePreferredCategory(category))
   };
};