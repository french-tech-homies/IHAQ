import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Author {
  name: string;
}

interface AuthorsState {
  byId: Record<string, Author>;
  allIds: string[];
}
const initialState: AuthorsState = { byId: {}, allIds: [] };

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    addAuthor(state, action: PayloadAction<{ authorId: string; author: Author }>) {
      const { authorId, author } = action.payload;
      if (!state.byId[authorId]) {
        state.allIds.push(authorId);
        state.byId[authorId] = author;
      }
    }
  }
});

export const { addAuthor } = authorsSlice.actions;
export const authors = authorsSlice.reducer;
