import { ReactNode, JSX } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <html lang="en">
            <body className="antialiased">
                { children }
            </body>
        </html>
    );
}
