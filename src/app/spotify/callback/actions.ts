'use server';

import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

export async function setCookie(cookie: ResponseCookie): Promise<void> {
    const cookieStore: ReadonlyRequestCookies = await cookies();
    cookieStore.set(cookie);
}

export async function getAuthorizationHeader(): Promise<string> {
    const authorizationHeaderBuffer: Buffer = Buffer.from(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID! + ':' + process.env.SPOTIFY_CLIENT_SECRET!);
    const authorizationHeader: string = authorizationHeaderBuffer.toString('base64');
    return authorizationHeader;
}
