import { AppState } from '../rootReducer';
import { createSelector } from '@reduxjs/toolkit';
import { getAuthorMessagesById } from '../authorMessages/authorMessages.selectors';
import { getMessage, messagesSelector, getMessages } from '../messages/messages.selectors';
import { scalePow } from 'd3-scale';

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

export const getAuthorsWithScore = createSelector(
  [authorsSelector, getAuthorMessages, getMessages],
  (state, getAuthorMessages, messages) => {
    const allLikes = messages.map(message => message.likes);
    const min = Math.min(...allLikes);
    const max = Math.max(...allLikes);
    const scale = scalePow()
      .exponent(0.45)
      .domain([min, max])
      .range([1, 10]);
    console.log('allLikes', allLikes);
    return Object.values(state.byId).map(author => {
      const messages = getAuthorMessages(author.id);
      const countOfMessages = messages.length;
      const countOfLikes = messages.reduce((acc, message) => {
        acc += message.likes;
        return acc;
      }, 0);
      console.log('coeff scaled', scale(countOfLikes));
      return {
        author,
        score: (countOfLikes + 1) * countOfMessages
      };
    });
  }
);

export const getMessagesWithUser = createSelector(messagesSelector, makeGetAuthor, (state, getAuthor) =>
  Object.values(state.byId).map(message => {
    return { message, author: getAuthor(message.authorId) };
  })
);
