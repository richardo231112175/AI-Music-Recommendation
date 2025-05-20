import { type ReactNode, type JSX } from 'react';
import StateProvider from '@/components/StateProvider';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <html lang="en" className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-ring">
            <body className="min-w-80 text-sm md:text-base antialiased">
                <StateProvider>
                    { children }
                </StateProvider>
            </body>
        </html>
    );
}
