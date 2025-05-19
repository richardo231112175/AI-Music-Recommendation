/* eslint-disable @typescript-eslint/typedef */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type messageType = {
    sender: 'user' | 'ai',
    text: string,
};

type initialStateType = {
    messages: messageType[];
};

const initialState: initialStateType = {
    messages: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<messageType>) => {
            state.messages.push(action.payload);
        },
    },
});

export const { addChat } = chatSlice.actions;
export default chatSlice.reducer;
