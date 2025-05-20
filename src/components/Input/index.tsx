'use client';

import { type JSX } from 'react';
import { FaSquare, FaPaperPlane } from 'react-icons/fa';
import { Button } from '@/components/Button';
import { type useInputReturn, useInput } from './hooks';

export default function Input(): JSX.Element {
    const { showPlaceholder, buttonDisabled, containerRef, inputRef, buttonRef, isPrompting, containerClickHandler, keyDownHandler, stopClickHandler, sendClickHandler }: useInputReturn = useInput();

    return (
        <div ref={ containerRef } onClick={ containerClickHandler } className="w-full px-3 py-2 md:px-4 md:py-3 space-y-2 md:space-y-3 relative bg-input rounded-xl cursor-text">
            <div className="flex-1 overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground">
                { showPlaceholder && <p className="absolute text-muted-foreground">Enter your mood, a preferred song, or a song you like!</p> }
                <div ref={ inputRef } onKeyDown={ keyDownHandler } autoFocus contentEditable suppressContentEditableWarning spellCheck={ false } autoCapitalize="off" autoCorrect="off" className="w-full h-full max-h-36 outline-none"></div>
            </div>
            <div className="text-right">
                {
                    isPrompting
                        ? <Button onClick={ stopClickHandler } size="icon" className="rounded-full cursor-pointer">
                            <FaSquare />
                        </Button>
                        : <Button ref={ buttonRef } onClick={ sendClickHandler } disabled={ buttonDisabled } size="icon" className="rounded-full cursor-pointer">
                            <FaPaperPlane />
                        </Button>
                }
            </div>
        </div>
    );
}
