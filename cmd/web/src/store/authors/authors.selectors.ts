import { AppState } from '../rootReducer';
import { createSelector } from '@reduxjs/toolkit';
import { getAuthorMessagesById } from '../authorMessages/authorMessages.selectors';
import { getMessage, messagesSelector } from '../messages/messages.selectors';

export const authorsSelector = (state: AppState) => state.authors;
export const makeGetAuthor = createSelector(authorsSelector, state => (authorId: string) => state.byId[authorId]);
export const getAuthors = createSelector(authorsSelector, state => Object.values(state.byId));
export const getAuthorMessages = createSelector([getAuthorMessagesById, getMessage], (byId, getMessage) => (authorId: string) => {
  if (byId[authorId]) {
    return byId[authorId].map(messageId => {
      return getMessage(messageId);
    });
  } else {
    return [];
  }
});

export const getAuthorsWithScore = createSelector([authorsSelector, getAuthorMessages], (state, getAuthorMessages) =>
  Object.values(state.byId).map(author => {
    const messages = getAuthorMessages(author.id);
    const countOfMessages = messages.length;
    const countOfLikes = messages.reduce((acc, message) => {
      acc += message.likes;
      return acc;
    }, 0);
    return {
      author,
      score: (countOfLikes + 1) * countOfMessages
    };
  })
);

export const getMessagesWithUser = createSelector(messagesSelector, makeGetAuthor, (state, getAuthor) =>
  Object.values(state.byId).map(message => {
    return { message, author: getAuthor(message.authorId) };
  })
);
