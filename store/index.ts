import { configureStore, createSlice } from '@reduxjs/toolkit';

// Example placeholder slice for future expansion
type PlaceholderState = { value: string };
const initialState: PlaceholderState = { value: 'init' };

const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = placeholderSlice.actions;

export const store = configureStore({
  reducer: {
    placeholder: placeholderSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 