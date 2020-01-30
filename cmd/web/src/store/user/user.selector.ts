import { AppState } from '../rootReducer';
import { createSelector } from '@reduxjs/toolkit';

export const userSelector = (state: AppState) => state.user;
export const getUser = createSelector(userSelector, user => user);
