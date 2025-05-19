import { type Dispatch, type SetStateAction, type RefObject, type MouseEvent, useState, useRef, useEffect } from 'react';
import { type AppDispatch, useAppDispatch } from '@/store';
import { addChat } from '@/store/chat';

export type useInputReturn = {
    showPlaceholder: boolean;
    buttonDisabled: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLDivElement | null>;
    buttonRef: RefObject<HTMLButtonElement | null>;
    containerClickHandler: () => void;
    buttonClickHandler: (e: MouseEvent<HTMLButtonElement>) => void;
};

export function useInput(): useInputReturn {
    const [ showPlaceholder, setShowPlaceholder ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);
    const [ buttonDisabled, setButtonDisabled ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);

    const containerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const inputRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const buttonRef: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement | null>(null);

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

    function buttonClickHandler(e: MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        if (inputRef.current && !buttonDisabled) {
            dispatch(addChat({
                sender: 'user',
                text: inputRef.current.innerText,
            }));
        }
    }

    return { showPlaceholder, buttonDisabled, containerRef, inputRef, buttonRef, containerClickHandler, buttonClickHandler };
}
