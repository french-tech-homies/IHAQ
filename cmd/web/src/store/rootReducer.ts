import { combineReducers } from '@reduxjs/toolkit';
import { authors } from './authors';
import { messages } from './messages';
import { authorMessages } from './authorMessages';
import { user } from './user';

export const rootReducer = combineReducers({
  authors,
  messages,
  authorMessages,
  user
});

export type AppState = ReturnType<typeof rootReducer>;
