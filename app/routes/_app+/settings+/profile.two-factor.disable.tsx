import { type SEOHandle } from '@nasa-gcn/remix-seo';
import { json, type DataFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { AuthenticityTokenInput } from 'remix-utils/csrf/react';
import { Icon } from '#app/components/ui/icon.tsx';
import { StatusButton } from '#app/components/ui/status-button.tsx';
import { requireRecentVerification } from '#app/routes/_auth+/verify.tsx';
import { requireUserId } from '#app/utils/auth.server.ts';
import { validateCSRF } from '#app/utils/csrf.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import { useDoubleCheck } from '#app/utils/misc.tsx';
import { redirectWithToast } from '#app/utils/toast.server.ts';
import { type BreadcrumbHandle } from './profile.tsx';
import { twoFAVerificationType } from './profile.two-factor.tsx';

export const handle: BreadcrumbHandle & SEOHandle = {
  breadcrumb: <Icon name="lock-open-1">Disable</Icon>,
  getSitemapEntries: () => null,
};

export async function loader({ request }: DataFunctionArgs) {
  await requireRecentVerification(request);
  return json({});
}

export async function action({ request }: DataFunctionArgs) {
  await requireRecentVerification(request);
  await validateCSRF(await request.formData(), request.headers);
  const userId = await requireUserId(request);
  await prisma.verification.delete({
    where: { target_type: { target: userId, type: twoFAVerificationType } },
  });
  return redirectWithToast('/settings/profile/two-factor', {
    title: '2FA Disabled',
    description: 'Two factor authentication has been disabled.',
  });
}

export default function TwoFactorDisableRoute() {
  const disable2FAFetcher = useFetcher<typeof action>();
  const dc = useDoubleCheck();

  return (
    <div className="mx-auto max-w-sm">
      <disable2FAFetcher.Form method="POST">
        <AuthenticityTokenInput />
        <p>
          Disabling two factor authentication is not recommended. However, if
          you would like to do so, click here:
        </p>
        <StatusButton
          variant="destructive"
          status={disable2FAFetcher.state === 'loading' ? 'pending' : 'idle'}
          {...dc.getButtonProps({
            className: 'mx-auto',
            name: 'intent',
            value: 'disable',
            type: 'submit',
          })}
        >
          {dc.doubleCheck ? 'Are you sure?' : 'Disable 2FA'}
        </StatusButton>
      </disable2FAFetcher.Form>
    </div>
  );
}
