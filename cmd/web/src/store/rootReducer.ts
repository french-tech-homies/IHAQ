import { combineReducers } from '@reduxjs/toolkit';
import { authors } from './authors';
import { messages } from './messages';

export const rootReducer = combineReducers({
  authors,
  messages
});

export type AppState = ReturnType<typeof rootReducer>;
