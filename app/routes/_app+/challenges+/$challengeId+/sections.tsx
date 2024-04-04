import { Outlet } from '@remix-run/react'

export default function ChallengeSections() {
	return (
		<div className="inset-0 flex h-full flex-col overflow-y-auto">
			<Outlet />
		</div>
	)
}
