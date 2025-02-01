import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkAction, Action } from '@reduxjs/toolkit';

import {createStore} from './createStore';

export * from './reducers';

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined|undefined,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector