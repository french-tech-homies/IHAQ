import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { messageService, IMessage } from '../../services/message.service';
import { morphism, createSchema } from 'morphism';
import { addAuthors, addAuthor } from '../authors/authors.slice';

import { socket } from '../../App';
import { addAuthorsMessages, addAuthorMessage } from '../authorMessages/authorMessage.slice';

interface Message {
  id: string;
  text: string;
  authorId: string;
  timestamp: number;
  likes: number;
}

interface MessagesState {
  byId: Record<string, Message>;
  allIds: string[];
}
const initialState: MessagesState = { byId: {}, allIds: [] };

// Slices - Reducers
// Internal at Redux - Sync call - Update redux state
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;
      _addMessage(state, message);
    },
    addMessages(state, action: PayloadAction<Message[]>) {
      const messages = action.payload;
      messages.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
      messages.forEach(message => {
        _addMessage(state, message);
      });
    },
    addLikeToMessage(state, action: PayloadAction<{ messageId: string }>) {
      const { messageId } = action.payload;
      const message = state.byId[messageId];
      message.likes++;
    }
  }
});

function _addMessage(state: MessagesState, message: Message) {
  if (!state.byId[message.id]) {
    state.allIds.push(message.id);
  }
  state.byId[message.id] = message;
}

const toMessage = morphism(
  createSchema<Message, IMessage>({
    authorId: ({ author }) => author,
    id: ({ id }) => id,
    text: ({ message }) => message,
    timestamp: ({ timestamp }) => timestamp,
    likes: ({ likes }) => (likes ? likes : 0)
  })
);

// Async Actions - Public - Call to external API
// Return type are the SYNC functions to call after the ASYNC is completed
export const fetchMessages = (): AppThunk<
  Promise<void>,
  ReturnType<typeof addMessages | typeof addAuthors | typeof addAuthorsMessages>
> => async dispatch => {
  // Call the async call to API
  const messages = await messageService.getMessages();
  // Morsphism
  const parsedMessages = toMessage(messages);
  // Updating the store via SYNC call
  const authors = parsedMessages.map(message => ({ id: message.authorId, name: message.authorId }));
  const authorsMessages = parsedMessages.map(message => ({ authorId: message.authorId, messageId: message.id }));
  dispatch(addAuthors(authors));
  dispatch(addMessages(parsedMessages));
  dispatch(addAuthorsMessages(authorsMessages));
};

export const postMessage = (
  message: Message
): AppThunk<Promise<void>, ReturnType<typeof addMessage | typeof addAuthor | typeof addAuthorMessage>> => async dispatch => {
  const newMessage = await messageService.postMessage({
    author: message.authorId,
    message: message.text,
    id: message.id,
    timestamp: message.timestamp
  });
  const parsedMessage = toMessage(newMessage);
  dispatch(addAuthor({ id: parsedMessage.authorId, name: parsedMessage.authorId }));
  dispatch(addMessage(parsedMessage));
  dispatch(addAuthorMessage({ authorId: parsedMessage.authorId, messageId: parsedMessage.id }));

  // Dirty Hack
  socket.send('New question posted : ' + message.text);
};

export const likeMessage = (messageId: string): AppThunk<Promise<void>, ReturnType<typeof addLikeToMessage>> => async dispatch => {
  await messageService.sendLike(messageId);
  dispatch(addLikeToMessage({ messageId }));
  socket.send(`New like sent to ${messageId}`);
};
export const { addMessage, addMessages, addLikeToMessage } = messagesSlice.actions;
export const messages = messagesSlice.reducer;
