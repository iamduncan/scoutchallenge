import { createId as cuid } from "@paralleldrive/cuid2";
import { redirect } from "@remix-run/node";
import { GoogleStrategy } from "remix-auth-google";
import { z } from "zod";
import { cache, cachified } from "../cache.server.ts";
import { connectionSessionStorage } from "../connections.server.ts";
import { prisma } from "../db.server.ts";
import { type Timings } from "../timing.server.ts";
import { type AuthProvider } from "./provider.ts";

const GoogleUserSchema = z.object({ login: z.string() });
const GoogleUserParseResult = z
  .object({
    success: z.literal(true),
    data: GoogleUserSchema,
  })
  .or(
    z.object({
      success: z.literal(false),
    }),
  );

const shouldMock = process.env.GOOGLE_CLIENT_ID?.startsWith("MOCK_");

export class GoogleProvider implements AuthProvider {
  getAuthStrategy() {
    return new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async ({ accessToken, refreshToken, extraParams, profile }) => {
        // Get the user data from your DB or API using the tokens and profile
        const user = await prisma.user.upsert({
          create: {
            email: profile.emails[0].value,
            name: profile.displayName,
            username: profile.displayName.toLowerCase().replace(/\s/g, "-"),
          },
          update: {
            email: profile.emails[0].value,
            name: profile.displayName,
            username: profile.displayName.toLowerCase().replace(/\s/g, "-"),
          },
          where: {
            email: profile.emails[0].value,
          },
        });
        if (!user) {
          throw new Error("Unable to create user");
        }
        return {
          email: user.email,
          id: profile.id,
          username: user.username,
          name: profile.name.givenName,
          imageUrl: profile.photos[0].value,
        };
      },
    );
  }

  async resolveConnectionData(
    providerId: string,
    { timings }: { timings?: Timings } = {},
  ) {
    const result = await cachified({
      key: `connection-data:github:${providerId}`,
      cache,
      timings,
      ttl: 1000 * 60,
      swr: 1000 * 60 * 60 * 24 * 7,
      async getFreshValue(context) {
        await new Promise((r) => setTimeout(r, 3000));
        const response = await fetch(
          `https://api.github.com/user/${providerId}`,
          { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } },
        );
        const rawJson = await response.json();
        const result = GoogleUserSchema.safeParse(rawJson);
        if (!result.success) {
          // if it was unsuccessful, then we should kick it out of the cache
          // asap and try again.
          context.metadata.ttl = 0;
        }
        return result;
      },
      checkValue: GoogleUserParseResult,
    });
    return {
      displayName: result.success ? result.data.login : "Unknown",
      link: result.success ? `https://github.com/${result.data.login}` : null,
    } as const;
  }

  async handleMockAction(request: Request) {
    if (!shouldMock) return;

    const connectionSession = await connectionSessionStorage.getSession(
      request.headers.get("cookie"),
    );
    const state = cuid();
    connectionSession.set("oauth2:state", state);
    const code = "MOCK_CODE_GITHUB_KODY";
    const searchParams = new URLSearchParams({ code, state });
    throw redirect(`/auth/github/callback?${searchParams}`, {
      headers: {
        "set-cookie":
          await connectionSessionStorage.commitSession(connectionSession),
      },
    });
  }
}
