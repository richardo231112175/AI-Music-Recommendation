import { redirect } from 'next/navigation';
import cryptoRandomString from 'crypto-random-string';

export default function SpotifyLoginPage(): never {
    const state: string = cryptoRandomString({ length: 16, type: 'alphanumeric' });
    const queries: Record<string, string> = {
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        scope: 'streaming user-read-email user-read-private',
        redirect_uri: process.env.APP_URI! + '/spotify/callback',
        state: state,
    };
    const queryParams: string = new URLSearchParams(queries).toString();

    return redirect('https://accounts.spotify.com/authorize/?' + queryParams);
}
