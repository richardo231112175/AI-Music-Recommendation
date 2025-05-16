'use client';

import { type JSX } from 'react';
import { FiSend } from 'react-icons/fi';
import { Button } from '@/components/Button';
import { type useInputReturn, useInput } from './hooks';

export default function Input(): JSX.Element {
    const { showPlaceholder, buttonDisabled, containerRef, inputRef, buttonRef, containerClickHandler, buttonClickHandler }: useInputReturn = useInput();

    return (
        <div ref={ containerRef } onClick={ containerClickHandler } className="w-full px-3 py-2 md:px-4 md:py-3 space-y-2 md:space-y-3 relative bg-input rounded-xl cursor-text">
            <div className="flex-1 overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground">
                { showPlaceholder && <p className="absolute text-muted-foreground">Enter your mood, a preferred song, or a song you like!</p> }
                <div ref={ inputRef } autoFocus contentEditable suppressContentEditableWarning spellCheck={ false } autoCapitalize="off" autoCorrect="off" className="w-full h-full max-h-36 outline-none"></div>
            </div>
            <div className="text-right">
                <Button ref={ buttonRef } onClick={ buttonClickHandler } disabled={ buttonDisabled } size="icon" className="rounded-full cursor-pointer">
                    <FiSend />
                </Button>
            </div>
        </div>
    );
}
