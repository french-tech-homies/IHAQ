import { AppState } from '../rootReducer';
import { createSelector } from '@reduxjs/toolkit';

export const authorMessagesSelector = (state: AppState) => state.authorMessages;
export const getAuthorMessagesById = createSelector(authorMessagesSelector, state => state.byId);
