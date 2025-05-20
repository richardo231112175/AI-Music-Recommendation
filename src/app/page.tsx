'use client';

import { type JSX } from 'react';
import Input from '@/components/Input';
import { useAppSelector } from '@/store';
import { type messageStateType } from '@/store/chat';
import ChatBubble from '@/components/ChatBubble';

export default function RootPage(): JSX.Element {
    const messages: messageStateType[] = useAppSelector((state) => state.chat.messages);

    return (
        <>
            <main className="max-w-3xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-40 space-y-8 relative">
                {
                    messages.map((message) => (
                        <ChatBubble key={ message.id } message={ message } />
                    ))
                }
            </main>
            <div className={ `${messages.length ? 'bottom-0' : 'bottom-1/2 translate-y-1/2'} w-full max-w-3xl min-w-80 mx-auto px-4 md:px-8 fixed left-1/2 -translate-x-1/2 space-y-4 transition` }>
                { !messages.length && <h2 className="text-center text-xl md:text-2xl font-semibold select-text">AI Music Recommendation</h2> }
                <div className={ messages.length ? 'pb-4 md:pb-8 bg-background rounded-t-xl' : '' }>
                    <Input />
                </div>
            </div>
        </>
    );
}
