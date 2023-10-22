import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { faker } from '@faker-js/faker';
import fsExtra from 'fs-extra';
import { HttpResponse, passthrough, http, type HttpHandler } from 'msw';

const { json } = HttpResponse;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const here = (...s: Array<string>) => path.join(__dirname, ...s);

const googleUserFixturePath = path.join(
  here(
    '..',
    'fixtures',
    'google',
    `users.${process.env.VITEST_POOL_ID || 0}.local.json`,
  ),
);

await fsExtra.ensureDir(path.dirname(googleUserFixturePath));

function createGoogleUser(code?: string | null) {
  const sub = code || faker.number.int().toString();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  return {
    id: sub,
    displayName: `${firstName} ${lastName}`,
    name: {
      familyName: lastName,
      givenName: firstName,
    },
    email: [{ value: email }],
    photos: [{ value: 'https://github.com/ghost.png' }],
    _json: {
      sub,
      name: `${firstName} ${lastName}`,
      given_name: firstName,
      family_name: lastName,
      picture: 'https://github.com/ghost.png',
      email: email,
      email_verified: true,
      locale: 'en',
      hd: 'example.com',
    },
  };
}

type GoogleUser = ReturnType<typeof createGoogleUser>;

async function getGoogleUsers() {
  try {
    if (await fsExtra.pathExists(googleUserFixturePath)) {
      const json = await fsExtra.readJson(googleUserFixturePath);
      return json as Array<GoogleUser>;
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deleteGoogleUsers() {
  await fsExtra.remove(googleUserFixturePath);
}

async function setGitHubUsers(users: Array<GoogleUser>) {
  await fsExtra.writeJson(googleUserFixturePath, users, { spaces: 2 });
}

export async function insertGoogleUser(code?: string | null) {
  const githubUsers = await getGoogleUsers();
  let user = githubUsers.find((u) => u.id === code);
  if (user) {
    Object.assign(user, createGoogleUser(code));
  } else {
    user = createGoogleUser(code);
    githubUsers.push(user);
  }
  await setGitHubUsers(githubUsers);
  return user;
}

async function getUser(request: Request) {
  const accessToken = request.headers
    .get('authorization')
    ?.slice('Bearer '.length);

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }
  const googleUsers = await getGoogleUsers();
  const user = googleUsers.find((u) => {
    return u.id === accessToken;
  });
  // console.log("user", user);

  if (!user) {
    return new Response('Not Found', { status: 404 });
  }
  return user;
}

const passthroughGoogle =
  !process.env.GOOGLE_CLIENT_ID.startsWith('MOCK_') && !process.env.TESTING;
export const handlers: Array<HttpHandler> = [
  http.post('https://oauth2.googleapis.com/token', async ({ request }) => {
    if (passthroughGoogle) return passthrough();
    const params = new URLSearchParams(await request.text());

    const code = params.get('code');
    const githubUsers = await getGoogleUsers();
    let user = githubUsers.find((u) => u.id === code);
    if (!user) {
      user = await insertGoogleUser(code);
    }

    return new Response(
      JSON.stringify({
        access_token: user.id,
        token_type: '__MOCK_TOKEN_TYPE__',
      }),
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    );
  }),
  http.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    async ({ request }) => {
      if (passthroughGoogle) return passthrough();

      // console.log("userinfo");

      const user = await getUser(request);
      if (user instanceof Response) return user;

      return json(user._json);
    },
  ),
  http.get('https://api.google.com/user/:id', async ({ params }) => {
    if (passthroughGoogle) return passthrough();

    const googleUsers = await getGoogleUsers();
    // console.log("googleUsers", googleUsers);
    const mockUser = googleUsers.find((u) => u.id === params.id);
    if (mockUser) return json(mockUser);

    return new Response('Not Found', { status: 404 });
  }),
  http.get('https://api.google.com/user', async ({ request }) => {
    if (passthroughGoogle) return passthrough();

    const user = await getUser(request);
    if (user instanceof Response) return user;

    return json(user);
  }),
  http.get('https://github.com/ghost.png', async () => {
    if (passthroughGoogle) return passthrough();

    const buffer = await fsExtra.readFile('./tests/fixtures/github/ghost.jpg');
    return new Response(buffer, {
      // the .png is not a mistake even though it looks like it... It's really a jpg
      // but the ghost image URL really has a png extension 😅
      headers: { 'content-type': 'image/jpg' },
    });
  }),
];
