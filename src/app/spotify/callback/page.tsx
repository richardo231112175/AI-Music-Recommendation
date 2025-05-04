import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { JSX } from 'react';
import axios, { AxiosResponse } from 'axios';

type SpotifyCallbackPageProps = {
    searchParams: SearchParams;
};

export default async function SpotifyCallbackPage({ searchParams }: SpotifyCallbackPageProps): Promise<never | JSX.Element> {
    const searchParamsCode: string | undefined = (await searchParams).code as string | undefined;
    const searchParamsState: string | undefined = (await searchParams).state as string | undefined;

    const code: string | undefined = searchParamsCode?.split(' ')[0];
    const state: string | undefined = searchParamsState?.split(' ')[0];

    if (!code || !state) {
        return redirect(process.env.APP_URI!);
    }

    const data: Record<string, string> = {
        code: code,
        redirect_uri: process.env.APP_URI! + '/spotify/callback',
        grant_type: 'authorization_code',
    };
    const authorizationBuffer: string = Buffer.from(process.env.SPOTIFY_CLIENT_ID! + ':' + process.env.SPOTIFY_CLIENT_SECRET!).toString('base64');

    try {
        const response: AxiosResponse<string, unknown> = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authorizationBuffer,
            },
        });

        console.log(response);
    } catch(error) {
        console.log(error);
    }

    return (
        <h1>Spotify Callback Page</h1>
    );
}
