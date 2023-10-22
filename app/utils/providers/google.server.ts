import { createId as cuid } from '@paralleldrive/cuid2';
import { redirect } from '@remix-run/node';
import { GoogleStrategy } from 'remix-auth-google';
// import { z } from "zod";
// import { cache, cachified } from "../cache.server.ts";
import { connectionSessionStorage } from '../connections.server.ts';
import { prisma } from '../db.server.ts';
import { type Timings } from '../timing.server.ts';
import { type AuthProvider } from './provider.ts';

// const GoogleUserSchema = z.object({ login: z.string() });
// const GoogleUserParseResult = z
//   .object({
//     success: z.literal(true),
//     data: GoogleUserSchema,
//   })
//   .or(
//     z.object({
//       success: z.literal(false),
//     }),
//   );

const shouldMock = process.env.GOOGLE_CLIENT_ID?.startsWith('MOCK_');

export class GoogleProvider implements AuthProvider {
  getAuthStrategy() {
    return new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async ({ accessToken, refreshToken, extraParams, profile }) => {
        // Get the user data from your DB or API using the tokens and profile
        // console.log("profile", profile);
        const user = await prisma.user.upsert({
          create: {
            email: profile._json.email,
            name: `${profile._json.given_name} ${profile._json.family_name}`,
            username: `${profile._json.given_name} ${profile._json.family_name}`
              .toLowerCase()
              .replace(/\s/g, '_'),
          },
          update: {
            email: profile._json.email,
            name: profile._json.name,
            username: profile._json.name.toLowerCase().replace(/\s/g, '_'),
          },
          where: {
            email: profile._json.email,
          },
        });
        if (!user) {
          throw new Error('Unable to create user');
        }
        return {
          email: user.email,
          id: profile._json.sub,
          username: user.username,
          name: profile._json.name,
          imageUrl: profile._json.picture,
        };
      },
    );
  }

  async resolveConnectionData(
    providerId: string,
    { timings }: { timings?: Timings } = {},
  ) {
    // const result = await cachified({
    //   key: `connection-data:google:${providerId}`,
    //   cache,
    //   timings,
    //   ttl: 1000 * 60,
    //   swr: 1000 * 60 * 60 * 24 * 7,
    //   async getFreshValue(context) {
    //     await new Promise((r) => setTimeout(r, 3000));
    //     const response = await fetch(
    //       "https://www.googleapis.com/oauth2/v3/userinfo",
    //       { headers: { Authorization: `Bearer ${process.env.GOOGLE_TOKEN}` } },
    //     );
    //     const rawJson = await response.json();
    //     const result = GoogleUserSchema.safeParse(rawJson);
    //     if (!result.success) {
    //       // if it was unsuccessful, then we should kick it out of the cache
    //       // asap and try again.
    //       context.metadata.ttl = 0;
    //     }
    //     return result;
    //   },
    //   checkValue: GoogleUserParseResult,
    // });
    // return {
    //   displayName: result.success ? result.data.login : "Unknown",
    //   link: result.success ? `https://google.com/${result.data.login}` : null,
    // } as const;
    return {
      displayName: 'Unknown',
      link: null,
    };
  }

  async handleMockAction(request: Request) {
    if (!shouldMock) return;

    const connectionSession = await connectionSessionStorage.getSession(
      request.headers.get('cookie'),
    );
    const state = cuid();
    connectionSession.set('oauth2:state', state);
    const code = 'MOCK_CODE_GOOGLE_KODY';
    const searchParams = new URLSearchParams({ code, state });
    throw redirect(`/auth/google/callback?${searchParams}`, {
      headers: {
        'set-cookie':
          await connectionSessionStorage.commitSession(connectionSession),
      },
    });
  }
}
