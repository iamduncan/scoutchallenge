import { invariantResponse } from '@epic-web/invariant'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type SettingsHeaderHandle } from '../settings'

export const handle: SettingsHeaderHandle & SEOHandle = {
	settingHeader: () => ({
		title: 'Profile Settings',
		description:
			'Keep your account safe by changing your password. You can change your password at any time.',
	}),
	getSitemapEntries: () => null,
}

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { username: true },
	})
	invariantResponse(user, 'User not found', { status: 404 })
	return json({})
}

export default function EditUserProfile() {
	return (
		<main className="mx-auto bg-muted px-6 py-8 md:container md:rounded">
			<Outlet />
		</main>
	)
}
