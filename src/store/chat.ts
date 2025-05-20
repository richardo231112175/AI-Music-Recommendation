/* eslint-disable @typescript-eslint/typedef */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

type messageType = {
    sender: 'user' | 'system';
    text: string;
} | {
    sender: 'ai';
    text: string[];
};

export type messageStateType = messageType & {
    id: string;
};

type initialStateType = {
    messages: messageStateType[];
    isPrompting: boolean;
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState: <initialStateType> {
        messages: [],
        isPrompting: false,
    },
    reducers: {
        addChat: (state, action: PayloadAction<messageType>) => {
            const message: messageStateType = {
                id: uuidv4(),
                ...action.payload,
            };
            state.messages.push(message);
        },
        setPrompt: (state, action: PayloadAction<{ index: number, text: string }>) => {
            const lastIndex: number = state.messages.length - 1;

            if (lastIndex >= 0 && state.messages[lastIndex].sender === 'ai') {
                state.messages[lastIndex].text[action.payload.index] = action.payload.text;
            }
        },
        setSystemError: (state, action: PayloadAction<string>) => {
            const lastIndex: number = state.messages.length - 1;

            if (lastIndex >= 0 && state.messages[lastIndex].sender === 'ai') {
                state.messages[lastIndex] = {
                    id: state.messages[lastIndex].id,
                    sender: 'system',
                    text: action.payload,
                };
            }
        },
        setIsPrompting: (state, action: PayloadAction<boolean>) => {
            state.isPrompting = action.payload;
        },
    },
});

export const { addChat, setPrompt, setSystemError, setIsPrompting } = chatSlice.actions;
export default chatSlice.reducer;
