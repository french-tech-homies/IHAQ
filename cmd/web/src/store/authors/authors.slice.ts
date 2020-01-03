import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Author {
  id: string;
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
    addAuthor(state, action: PayloadAction<Author>) {
      const author = action.payload;
      if (!state.byId[author.id]) {
        state.allIds.push(author.id);
        state.byId[author.id] = author;
      }
    },
    addAuthors(state, action: PayloadAction<Author[]>) {
      const authors = action.payload;
      authors.forEach(author => {
        state.byId[author.id] = author;
        state.allIds.push(author.id);
      });
    }
  }
});

export const { addAuthor, addAuthors } = authorsSlice.actions;
export const authors = authorsSlice.reducer;
