import { configureStore } from '@reduxjs/toolkit';
import { identity } from './reducers';

export const createStore = () => {
  return configureStore({
    reducer: {
      identity: identity.reducer
    }
  });
}