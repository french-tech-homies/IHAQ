// Selector are memorized function
// Helper functions around GET
// Examples : Having filtered list of author ID
import { AppState } from '../rootReducer';
import { createSelector } from '@reduxjs/toolkit';

export const messagesSelector = (state: AppState) => state.messages;
export const getMessages = createSelector(messagesSelector, state => Object.values(state.byId));

export const getMessage = createSelector(messagesSelector, state => (messageId: string) => {
  return state.byId[messageId];
});
