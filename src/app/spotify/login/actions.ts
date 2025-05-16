'use server';

import { type RequestCookie, type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

export type getTokensReturn = {
    accessToken: RequestCookie | undefined;
    refreshToken: RequestCookie | undefined;
};

export async function getTokens(): Promise<getTokensReturn> {
    const cookieStore: ReadonlyRequestCookies = await cookies();
    const accessToken: RequestCookie | undefined = cookieStore.get('access_token');
    const refreshToken: RequestCookie | undefined = cookieStore.get('refresh_token');
    return { accessToken, refreshToken };
}

export async function setCookie(cookie: ResponseCookie): Promise<void> {
    const cookieStore: ReadonlyRequestCookies = await cookies();
    cookieStore.set(cookie);
}
