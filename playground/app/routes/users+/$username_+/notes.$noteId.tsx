import { type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

// 🐨 get the db utility using:
import { db } from '#app/utils/db.server.ts'

// 🐨 export a loader function here
export async function loader({ params }: LoaderFunctionArgs) {
	// 💰 Here's how you get the user from the database:
	const note = db.note.findFirst({
		where: {
			id: { equals: params.noteId },
		},
	})

	const body = JSON.stringify({
		note,
	})
	console.log(body)
	// 🐨 Return the necessary user data using Remix's json util
	// return json({
	// 	// 🦺 TypeScript will complain about the user being possibly undefined, we'll
	// 	// fix that in the next section
	// 	// @ts-expect-error
	// 	owner: { name: owner.name, username: owner.username, notes },
	// })
	// 💯 as extra credit, try to do it with new Response instead of using the json util just for fun
	// 🦉 Note, you should definitely use the json helper as it's easier and works better with TypeScript
	// but feel free to try it with new Response if you want to see how it works.
	return new Response(body, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export default function NoteRoute() {
	// 💣 you can remove the params here, we don't need it anymore
	// const params = useParams()
	// 🐨 get the data from the loader using useLoaderData
	const params = useLoaderData<typeof loader>() as {
		note: {
			content: string
			title: string
		}
	}
	const { content, title } = params.note

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">
				{/* (🐨 replace this with the title) */}
				{title}
			</h2>
			<div className="overflow-y-auto pb-24">
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{/* 🐨 Note content goes here... */}
					{content}
				</p>
			</div>
		</div>
	)
}
