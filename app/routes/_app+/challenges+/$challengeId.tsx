import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ChallengeStatus, type Role } from '@prisma/client';
import { type LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData, useSearchParams } from '@remix-run/react';
import { ChallengeHero } from '#app/components/ui/index.ts';
import { getChallenge } from '#app/models/challenge.server.ts';
import { getUserById } from '#app/models/user.server.ts';
import { requireUserId } from '#app/utils/auth.server.ts';
import { redirectWithToast } from '#app/utils/toast.server.ts';

const isAdminRole = (role: Pick<Role, 'name'>) =>
  role.name === 'ADMIN' ||
  role.name === 'GROUPADMIN' ||
  role.name === 'SECTIONADMIN';
const isAdmin = (roles: Pick<Role, 'name'>[]) => roles.some(isAdminRole);

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  if (!user) throw redirect('/login');

  const challengeId = params.challengeId;
  if (!challengeId) {
    throw new Response('Not Found', { status: 404 });
  }
  const challenge = await getChallenge({ id: challengeId });
  console.log(challenge);
  if (
    user &&
    !isAdmin(user.roles) &&
    (challenge.status === ChallengeStatus.DRAFT ||
      challenge.status === ChallengeStatus.DELETED)
  ) {
    throw redirectWithToast('/challenges', {
      title: 'You do not have permission to view this challenge.',
      description: 'Please contact an administrator.',
      type: 'error',
    });
  }
  return json({
    challenge: {
      ...challenge,
    },
    user,
  });
};

const ChallengeView = () => {
  const { user, challenge } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div>
      <ChallengeHero
        title={challenge.name}
        userProgress={0}
        endDate={challenge.closeDate}
      />
      {isAdmin(user.roles) && challenge.status === ChallengeStatus.DRAFT && (
        <div className="mx-auto mt-6 flex w-11/12 items-center justify-center gap-2 rounded border border-red-500 bg-red-100 py-3 text-xl font-semibold text-red-600 md:w-10/12">
          <ExclamationTriangleIcon className="h-6 w-6" /> Challenge is not
          published.
        </div>
      )}

      <Outlet />

      {searchParams.get('debug') === 'true' && (
        <div className="container overflow-x-auto">
          <pre>{JSON.stringify(challenge, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ChallengeView;
