import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import cryptoRandomString from 'crypto-random-string';
import { type getTokensReturn, getTokens, setCookie } from './actions';

type responseType = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
};

export function useSpotifyLogin(): void {
    const router: AppRouterInstance = useRouter();

    useEffect(() => {
        async function initialize(): Promise<void> {
            const { accessToken, refreshToken }: getTokensReturn = await getTokens();

            if (accessToken) {
                router.replace('/');
                return;
            }

            if (refreshToken) {
                const spotifyBody: URLSearchParams = new URLSearchParams();
                spotifyBody.append('client_id', process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!);
                spotifyBody.append('refresh_token', refreshToken.value);
                spotifyBody.append('grant_type', 'refresh_token');

                const spotifyUrl: string = 'https://accounts.spotify.com/api/token';
                const spotifyData: string = spotifyBody.toString();
                const spotifyConfig: AxiosRequestConfig<string> = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                };

                try {
                    const response: AxiosResponse<responseType> = await axios.post(spotifyUrl, spotifyData, spotifyConfig);

                    setCookie({
                        name: 'access_token',
                        value: response.data.access_token,
                        maxAge: response.data.expires_in,
                        httpOnly: true,
                    });

                    if (response.data.refresh_token) {
                        setCookie({
                            name: 'refresh_token',
                            value: response.data.refresh_token,
                            httpOnly: true,
                        });
                    }

                    return;
                } catch {}
            }

            const state: string = cryptoRandomString({ length: 16, type: 'alphanumeric' });

            const searchParams: URLSearchParams = new URLSearchParams();
            searchParams.append('response_type', 'code');
            searchParams.append('client_id', process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!);
            searchParams.append('scope', 'streaming user-read-email user-read-private');
            searchParams.append('redirect_uri', process.env.NEXT_PUBLIC_APP_URI! + '/spotify/callback');
            searchParams.append('state', state);

            const params: string = searchParams.toString();

            router.replace('https://accounts.spotify.com/authorize/?' + params);
        }

        initialize();
    }, [ router ]);
}
