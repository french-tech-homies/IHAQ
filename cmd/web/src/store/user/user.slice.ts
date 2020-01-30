import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
}

const initialState: User = { id: '' };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser(state, action: PayloadAction<{ userId: string }>) {
      const { userId } = action.payload;
      state.id = userId;
    }
  }
});

export const { saveUser } = userSlice.actions;
export const user = userSlice.reducer;
