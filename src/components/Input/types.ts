import { RefObject, MouseEvent } from 'react';

export type useInputReturn = {
    showPlaceholder: boolean;
    buttonDisabled: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLDivElement | null>;
    buttonRef: RefObject<HTMLButtonElement | null>;
    containerClickHandler: () => void;
    buttonClickHandler: (e: MouseEvent<HTMLButtonElement>) => void;
};
