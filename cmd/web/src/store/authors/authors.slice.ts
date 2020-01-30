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
      _addAuthor(state, author);
    },
    addAuthors(state, action: PayloadAction<Author[]>) {
      const authors = action.payload;
      authors.forEach(author => {
        _addAuthor(state, author);
      });
    }
  }
});

function _addAuthor(state: AuthorsState, author: Author) {
  if (!state.byId[author.id]) {
    state.allIds.push(author.id);
    state.byId[author.id] = author;
  }
}

export const { addAuthor, addAuthors } = authorsSlice.actions;
export const authors = authorsSlice.reducer;
