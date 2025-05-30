'use client';

import { type JSX } from 'react';
import parse from 'html-react-parser';
import { useAppSelector } from '@/store';
import { type messageStateType } from '@/store/chat';
import { PulseLoader } from 'react-spinners';
import { FaExternalLinkAlt } from 'react-icons/fa';

type ChatBubbleProps = {
    message: messageStateType;
};

export default function ChatBubble({ message }: ChatBubbleProps): JSX.Element {
    const isPrompting: boolean = useAppSelector((state) => state.chat.isPrompting);
    const lastMessage: messageStateType | undefined = useAppSelector((state) => state.chat.messages).at(-1);

    if (message.sender === 'system') {
        return (
            <div id={ message.id } className="w-full flex justify-start select-text">
                <div className="w-fit text-[var(--destructive)] break-words overflow-hidden">
                    { message.text }
                </div>
            </div>
        );
    }

    if (message.sender === 'ai') {
        if (!message.text.length && isPrompting && message.id === lastMessage?.id) {
            return (
                <div id={ message.id } className="w-full flex justify-start select-text">
                    <div className="w-fit break-words overflow-hidden">
                        <PulseLoader size={ 8 } speedMultiplier={ 0.8 } color="var(--foreground)" />
                    </div>
                </div>
            );
        }

        return (
            <div id={ message.id } className="w-full flex justify-start select-text">
                <div className="w-fit break-words overflow-hidden">
                    { message.text.length && <ul>
                        { message.text.map((text, index) => {
                            const key: string = message.id + index;
                            let youtubeLink: string | undefined;

                            if (text.includes('{{') && text.includes('}}')) {
                                const startIndex: number = text.indexOf('{{');
                                const endIndex: number = text.indexOf('}}');
                                
                                youtubeLink = text.substring(startIndex + 2, endIndex);
                                text = text.substring(0, startIndex);
                            }

                            return (
                                <p key={ key } className="flex items-center gap-2">
                                    { parse(text) }
                                    { youtubeLink && <a href={ youtubeLink } title="View video" target="_blank" className="text-xs">
                                        <FaExternalLinkAlt />
                                    </a> }
                                </p>
                            );
                        }) }
                    </ul> }
                </div>
            </div>
        );
    }

    return (
        <div id={ message.id } className="w-full flex justify-end select-text">
            <div className="w-fit max-w-3/5 px-4 py-2 break-words overflow-hidden bg-input rounded-xl">
                { message.text }
            </div>
        </div>
    );
}
