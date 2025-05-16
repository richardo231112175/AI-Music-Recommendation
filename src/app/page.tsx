import { type JSX } from 'react';
import Input from '@/components/Input';

export default function RootPage(): JSX.Element {
    return (
        <>
            <main className="max-w-3xl mx-auto px-4 md:px-8 relative"></main>
            <div className="w-full max-w-3xl min-w-80 mx-auto px-4 md:px-8 fixed bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 space-y-4">
                <h2 className="text-center text-xl md:text-2xl font-semibold">AI Music Recommendation</h2>
                <Input />
            </div>
        </>
    );
}
