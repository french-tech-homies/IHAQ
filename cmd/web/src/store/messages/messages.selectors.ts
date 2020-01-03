// Selector are memorized function
// Helper functions around GET
// Examples : Having filtered list of author ID
import { AppState } from '../rootReducer';
import { createSelector } from '@reduxjs/toolkit';
import { makeGetAuthor } from '../authors';

export const messagesSelector = (state: AppState) => state.messages;
export const getMessages = createSelector(messagesSelector, state => Object.values(state.byId));
export const getMessagesWithUser = createSelector(messagesSelector, makeGetAuthor, (state, getAuthor) =>
  Object.values(state.byId).map(message => {
    return { message, author: getAuthor(message.authorId) };
  })
);
