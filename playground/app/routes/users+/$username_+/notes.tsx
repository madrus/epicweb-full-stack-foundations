import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'

import { db } from '#app/utils/db.server.ts'
import { cn, invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: LoaderFunctionArgs) {
	const owner = db.user.findFirst({
		where: {
			username: {
				equals: params.username,
			},
		},
	})
	// 🐨 add an if statement here to check whether the owner exists and throw an
	// appropriate 404 response if not.
	// 💯 as an extra credit, you can try using the invariantResponse utility from
	// "#app/utils/misc.ts" to do this in a single line of code (just make sure to
	// supply the proper status code)
	// if (!owner) {
	invariantResponse(owner, `Owner ${params.username} not found`, {
		status: 404,
	})
	// throw new Response(`Owner ${params.username} not found`, { status: 404 })
	// }
	// 🦺 then you can remove both of the @ts-expect-errors below 🎉
	const notes = db.note
		.findMany({
			where: {
				owner: {
					username: {
						equals: params.username,
					},
				},
			},
		})
		.map(({ id, title }) => ({ id, title }))
	return json({ owner, notes })
}

export default function NotesRoute() {
	const data = useLoaderData<typeof loader>()
	const ownerDisplayName = data.owner.name ?? data.owner.username
	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'
	return (
		<main className="container flex h-full min-h-[400px] pb-12 px-0 md:px-8">
			<div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
				<div className="relative col-span-1">
					<div className="absolute inset-0 flex flex-col">
						<Link to=".." relative="path" className="pb-4 pl-8 pr-4 pt-12">
							<h1 className="text-base font-bold md:text-lg lg:text-left lg:text-2xl">
								{ownerDisplayName}'s Notes
							</h1>
						</Link>
						<ul className="overflow-y-auto overflow-x-hidden pb-12">
							{data.notes.map(note => (
								<li key={note.id} className="p-1 pr-0">
									<NavLink
										to={note.id}
										className={({ isActive }) =>
											cn(navLinkDefaultClassName, isActive && 'bg-accent')
										}
									>
										{note.title}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="relative col-span-3 bg-accent md:rounded-r-3xl">
					<Outlet />
				</div>
			</div>
		</main>
	)
}
