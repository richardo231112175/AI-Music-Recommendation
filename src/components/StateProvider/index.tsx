'use client';

import { type ReactNode, type JSX } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';

type StateProviderProps = {
    children: ReactNode;
};

export default function StateProvider({ children }: StateProviderProps): JSX.Element {
    return (
        <Provider store={store}>
            { children }
        </Provider>
    );
}
