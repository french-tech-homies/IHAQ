import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthorMessagesState {
  byId: Record<string, string[]>;
  allIds: string[];
}
const initialState: AuthorMessagesState = { byId: {}, allIds: [] };

const authorMessageSlice = createSlice({
  name: 'authorMessages',
  initialState,
  reducers: {
    addAuthorMessage(state, action: PayloadAction<{ authorId: string; messageId: string }>) {
      const { authorId, messageId } = action.payload;
      _addAuthorMessage(state, { authorId, messageId });
    },
    addAuthorsMessages(state, action: PayloadAction<{ authorId: string; messageId: string }[]>) {
      const authorsMessages = action.payload;
      authorsMessages.forEach(authorMessage => {
        _addAuthorMessage(state, authorMessage);
      });
    }
  }
});

function _addAuthorMessage(state: AuthorMessagesState, payload: { authorId: string; messageId: string }) {
  const { authorId, messageId } = payload;

  if (!state.byId[authorId]) {
    state.allIds.push(authorId);
    state.byId[authorId] = [];
  }
  state.byId[authorId] = [...new Set([...state.byId[authorId], messageId])];
}

export const { addAuthorMessage, addAuthorsMessages } = authorMessageSlice.actions;
export const authorMessages = authorMessageSlice.reducer;
