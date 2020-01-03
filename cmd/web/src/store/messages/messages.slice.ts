import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { messageService, IMessage } from '../../services/message.service';
import { morphism, createSchema } from 'morphism';

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
  name: 'authors',
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
export const fetchMessages = (): AppThunk<Promise<void>, ReturnType<typeof addMessages>> => async dispatch => {
  const messages = await messageService.getMessages();
  dispatch(addMessages(toMessage(messages)));
};

export const { addMessage, addMessages } = messagesSlice.actions;
export const messages = messagesSlice.reducer;
