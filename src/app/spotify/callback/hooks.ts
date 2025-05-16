import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { type ReadonlyURLSearchParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { getAuthorizationHeader, setCookie } from './actions';

type responseType = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
};

export function useSpotifyCallback(): void {
    const searchParams: ReadonlyURLSearchParams = useSearchParams();
    const router: AppRouterInstance = useRouter();

    useEffect(() => {
        async function initialize(): Promise<void> {
            const code: string | null = searchParams.get('code');
            const state: string | null = searchParams.get('state');

            if (!code || !state) {
                router.replace('/');
                return;
            }

            const spotifyBody: URLSearchParams = new URLSearchParams();
            spotifyBody.append('code', code);
            spotifyBody.append('redirect_uri', process.env.NEXT_PUBLIC_APP_URI! + '/spotify/callback');
            spotifyBody.append('grant_type', 'authorization_code');

            const authorizationHeader: string = await getAuthorizationHeader();

            const spotifyUrl: string = 'https://accounts.spotify.com/api/token';
            const spotifyData: string = spotifyBody.toString();
            const spotifyConfig: AxiosRequestConfig<string> = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + authorizationHeader,
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

                setCookie({
                    name: 'refresh_token',
                    value: response.data.refresh_token,
                    httpOnly: true,
                });

                toast.success("You're now connected. Enjoy using the service.");
            } catch {
                toast.error('Something went wrong. Please try again.');
            }

            router.replace('/');
        }

        initialize();
    }, [ searchParams, router ]);
}
