/* eslint-disable @typescript-eslint/typedef */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    chat: { sender: 'user' | 'ai', chat: string }[];
};

const initialState: initialStateType = {
    chat: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<{ sender: 'user' | 'ai', chat: string }>) => {
            state.chat.push(action.payload);
        },
    },
});

export const { addChat } = chatSlice.actions;
export default chatSlice.reducer;
