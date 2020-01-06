import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { messageService, IMessage } from '../../services/message.service';
import { morphism, createSchema } from 'morphism';
import { addAuthors, addAuthor } from '../authors';

import {socket} from '../../App'


interface Message {
  id: string;
  text: string;
  authorId: string;
  timestamp: number;
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
      state.allIds.push(message.id);
      state.byId[message.id] = message;
    },
    addMessages(state, action: PayloadAction<Message[]>) {
      const messages = action.payload;
      messages.sort((a,b)  => { return a.timestamp  - b.timestamp });
      messages.forEach(message => {
        state.byId[message.id] = message;
        state.allIds.push(message.id);
      });
    }
  }
});

const toMessage = morphism(
  createSchema<Message, IMessage>({
    authorId: ({ author }) => author,
    id: ({ id }) => id,
    text: ({ message }) => message,
    timestamp: ({timestamp}) => timestamp
  })
);

// Async Actions - Public - Call to external API
// Return type are the SYNC functions to call after the ASYNC is completed
export const fetchMessages = (): AppThunk<Promise<void>, ReturnType<typeof addMessages | typeof addAuthors>> => async dispatch => {
  // Call the async call to API
  const messages = await messageService.getMessages();
  // Morsphism
  const parsedMessages = toMessage(messages);
  // Updating the store via SYNC call
  const authors = parsedMessages.map(message => ({ id: message.authorId, name: message.authorId }));
  dispatch(addAuthors(authors));
  dispatch(addMessages(parsedMessages));
};

export const postMessage = (message : Message): AppThunk<Promise<void>, ReturnType<typeof addMessage | typeof addAuthor>> => async dispatch => {
  const newMessage = await messageService.postMessage({author:message.authorId, message:message.text, id:message.id, timestamp:message.timestamp});
  const parsedMessage = toMessage(newMessage);
  dispatch(addAuthor({id: parsedMessage.authorId, name: parsedMessage.authorId }));
  dispatch(addMessage(parsedMessage));
  // Dirty Hack
  socket.send("New question posted : "+ message.text)
};

export const { addMessage, addMessages } = messagesSlice.actions;
export const messages = messagesSlice.reducer;
