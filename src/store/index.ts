/* eslint-disable @typescript-eslint/typedef */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '@/store/chat';

const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type useAppSelectorType = TypedUseSelectorHook<ReturnType<typeof store.getState>>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: useAppSelectorType = useSelector;
export default store;
