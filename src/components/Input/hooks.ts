import { type Dispatch, type SetStateAction, type RefObject, type KeyboardEvent, type MouseEvent, useState, useRef, useEffect } from 'react';
import store, { type AppDispatch, useAppSelector, useAppDispatch } from '@/store';
import { addChat, setPrompt, setSystemError, setIsPrompting } from '@/store/chat';
import { sendPrompt } from './action';

export type useInputReturn = {
    showPlaceholder: boolean;
    buttonDisabled: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLDivElement | null>;
    buttonRef: RefObject<HTMLButtonElement | null>;
    isPrompting: boolean;
    keyDownHandler: (e: KeyboardEvent<HTMLDivElement>) => void;
    containerClickHandler: () => void;
    stopClickHandler: (e: MouseEvent<HTMLButtonElement>) => void;
    sendClickHandler: (e: MouseEvent<HTMLButtonElement>) => void;
};

type promptResultType = {
    title: string;
    artist: string;
};

export function useInput(): useInputReturn {
    const [ showPlaceholder, setShowPlaceholder ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);
    const [ buttonDisabled, setButtonDisabled ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);

    const containerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const inputRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const buttonRef: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement | null>(null);

    const isPrompting: boolean = useAppSelector((state) => state.chat.isPrompting);

    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        const inputElement: HTMLDivElement | null = inputRef.current;

        function checkInput(): void {
            if (inputElement && !!inputElement.innerText.trim()) {
                setShowPlaceholder(false);
                setButtonDisabled(false);
            } else {
                setShowPlaceholder(true);
                setButtonDisabled(true);
            }
        }

        if (inputElement) {
            inputElement.addEventListener('input', checkInput);
        }

        return (): void => {
            if (inputElement) {
                inputElement.removeEventListener('input', checkInput);
            }
        };
    }, [ inputRef ]);

    function containerClickHandler(): void {
        if (inputRef.current) {
            inputRef.current.focus();

            const range: Range = document.createRange();
            const selection: Selection | null = window.getSelection();

            range.selectNodeContents(inputRef.current);
            range.collapse(false);

            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    }

    function keyDownHandler(e: KeyboardEvent<HTMLDivElement>): void {
        if (e.key === 'Enter' && !isPrompting) {
            e.preventDefault();
            submitHandler();
        }
    }

    function stopClickHandler(e: MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        if (inputRef.current && isPrompting) {
            dispatch(setIsPrompting(false));
        }
    }

    function sendClickHandler(e: MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();
        submitHandler();
    }

    function submitHandler(): void {
        if (inputRef.current && !buttonDisabled) {
            const prompt: string = inputRef.current.innerText;

            dispatch(addChat({
                sender: 'user',
                text: prompt,
            }));
            dispatch(addChat({
                sender: 'ai',
                text: [],
            }));
            dispatch(setIsPrompting(true));

            inputRef.current.innerText = '';
            setShowPlaceholder(true);
            setButtonDisabled(true);

            promptHandler(prompt);
        }
    }

    async function promptHandler(prompt: string): Promise<void> {
        try {
            const result: string | undefined = await sendPrompt(prompt);

            if (!result) {
                throw new Error;
            }

            const promptResults: promptResultType[] = await JSON.parse(result);

            for (const [ index, promptResult ] of promptResults.entries()) {
                if (!store.getState().chat.isPrompting) {
                    break;
                }

                let text: string = `${index + 1}. `;

                for (let i: number = 1; i <= text.length; i ++) {
                    if (!store.getState().chat.isPrompting) {
                        break;
                    }

                    await updatePrompt(index, text);
                }

                for (let i: number = 1; i <= promptResult.title.length; i ++) {
                    if (!store.getState().chat.isPrompting) {
                        break;
                    }

                    const temp: string = text + `<b>${promptResult.title.substring(0, i)}</b>`;
                    await updatePrompt(index, temp);
                }

                text += `<b>${promptResult.title}</b>`;

                for (let i: number = 1; i <= 3; i ++) {
                    if (!store.getState().chat.isPrompting) {
                        break;
                    }

                    const dash: string = ' - ';
                    const temp: string = text + dash.substring(0, i);
                    await updatePrompt(index, temp);
                }

                text += ' - ';

                for (let i: number = 1; i <= promptResult.artist.length; i ++) {
                    if (!store.getState().chat.isPrompting) {
                        break;
                    }

                    const temp: string = text + `<i>${promptResult.artist.substring(0, i)}</i>`;
                    await updatePrompt(index, temp);
                }
            }
        } catch {
            dispatch(setSystemError('Something went wrong!'));
        }

        if (store.getState().chat.isPrompting) {
            dispatch(setIsPrompting(false));
        }
    }

    async function updatePrompt(index: number, text: string): Promise<void> {
        await new Promise<void>((resolve) => setTimeout(() => {
            if (store.getState().chat.isPrompting) {
                dispatch(setPrompt({ index, text }));
            }

            resolve();
        }, 12));
    }

    return { showPlaceholder, buttonDisabled, containerRef, inputRef, buttonRef, isPrompting, containerClickHandler, keyDownHandler, stopClickHandler, sendClickHandler };
}
