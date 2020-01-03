import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { messageService, IMessage } from '../../services/message.service';
import { morphism, createSchema } from 'morphism';
import { addAuthors, addAuthor } from '../authors';

interface Message {
  id: string;
  text: string;
  authorId: string;
}

interface AuthorsState {
  byId: Record<string, Message>;
  allIds: string[];
}
const initialState: AuthorsState = { byId: {}, allIds: [] };

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
    text: ({ message }) => message
  })
);
export const fetchMessages = (): AppThunk<Promise<void>, ReturnType<typeof addMessages | typeof addAuthors>> => async dispatch => {
  const messages = await messageService.getMessages();
  const parsedMessages = toMessage(messages);
  const authors = parsedMessages.map(message => ({ id: message.authorId, name: message.authorId }));
  dispatch(addMessages(parsedMessages));
  dispatch(addAuthors(authors));
};

export const { addMessage, addMessages } = messagesSlice.actions;
export const messages = messagesSlice.reducer;
