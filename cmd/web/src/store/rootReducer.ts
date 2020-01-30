import { combineReducers } from '@reduxjs/toolkit';
import { authors } from './authors';
import { messages } from './messages';
import { authorMessages } from './authorMessages';

export const rootReducer = combineReducers({
  authors,
  messages,
  authorMessages
});

export type AppState = ReturnType<typeof rootReducer>;
