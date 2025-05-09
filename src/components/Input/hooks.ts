import { useState, useRef, useEffect, Dispatch, SetStateAction, RefObject, MouseEvent } from 'react';
import { useInputReturn } from './types';

export function useInput(): useInputReturn {
    const [ showPlaceholder, setShowPlaceholder ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);
    const [ buttonDisabled, setButtonDisabled ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(true);

    const containerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const inputRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const buttonRef: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement | null>(null);

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
            console.log(inputRef.current.innerText);
        }
    }

    return { showPlaceholder, buttonDisabled, containerRef, inputRef, buttonRef, containerClickHandler, buttonClickHandler };
}
