import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, type MetaFunction, useLoaderData } from '@remix-run/react'

import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import { db } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: LoaderFunctionArgs) {
	const user = db.user.findFirst({
		where: {
			username: {
				equals: params.username,
			},
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return json({
		user: { name: user.name, username: user.username },
	})
}

export default function ProfileRoute() {
	const data = useLoaderData<typeof loader>()
	return (
		<div className="container mb-48 mt-36">
			<h1 className="text-h1">{data.user.name ?? data.user.username}</h1>
			<Link to="notes" className="underline" prefetch="intent">
				Notes
			</Link>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
	const displayName = data?.user.name ?? params.username
	return [
		{ title: `${displayName} | Epic Notes` },
		{
			name: 'description',
			content: `Profile of ${displayName} on Epic Notes`,
		},
	]
}

export function ErrorBoundary() {
	// 🐨 you can swap most of this stuff for GeneralErrorBoundary and a statusHandler for 404
	const statusHandlers = {
		404: ({ params }: { params: Record<string, string | undefined> }) => (
			<p>No user found with the username {params.username}</p>
		),
	}

	return <GeneralErrorBoundary statusHandlers={statusHandlers} />
}
