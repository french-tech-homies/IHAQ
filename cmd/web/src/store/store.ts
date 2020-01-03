import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rootReducer, AppState } from './rootReducer';
import { ThunkAction } from 'redux-thunk';
import logger from 'redux-logger';

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware({ serializableCheck: false }), logger]
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export { store };
export type AppThunk<R = void, A extends Action = Action<string>> = ThunkAction<R, AppState, null, A>;
export type AppDispatch = typeof store.dispatch;
