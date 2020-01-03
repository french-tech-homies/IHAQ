import { combineReducers } from '@reduxjs/toolkit';
import { authors } from './authors';

export const rootReducer = combineReducers({
  authors
});

export type AppState = ReturnType<typeof rootReducer>;
