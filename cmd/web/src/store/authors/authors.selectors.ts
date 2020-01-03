import { AppState } from '../rootReducer';
import { createSelector } from '@reduxjs/toolkit';

export const authorsSelector = (state: AppState) => state.authors;
export const makeGetAuthor = createSelector(authorsSelector, state => (authorId: string) => state.byId[authorId]);
