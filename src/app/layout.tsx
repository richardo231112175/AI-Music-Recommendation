import { ReactNode, JSX } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <html lang="en">
            <body className="min-w-80 text-sm md:text-base antialiased">
                { children }
            </body>
        </html>
    );
}
