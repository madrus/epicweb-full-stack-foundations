import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'

import { floatingToolbarClassName } from '#app/components/floating-toolbar.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { db } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: LoaderFunctionArgs) {
	const note = db.note.findFirst({
		where: {
			id: {
				equals: params.noteId,
			},
		},
	})

	invariantResponse(note, 'Note not found', { status: 404 })

	return json({
		note: { title: note.title, content: note.content },
	})
}

export async function action({ request, params }: ActionFunctionArgs) {
	// 🐨 get the formData from the request
	const formData = await request.formData()
	// 🐨 get the intent from the formData
	const intent = formData.get('intent')
	// 🐨 if the intent is not "delete", then throw a 400 Response
	// 💰 you can use invariantResponse from '#app/utils/misc.tsx' for this
	invariantResponse(intent === 'delete', 'Invalid intent', { status: 400 })
	// 🐨 if the intent is "delete" then proceed

	db.note.delete({ where: { id: { equals: params.noteId } } })
	return redirect(`/users/${params.username}/notes`)
}

export default function NoteRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.note.title}</h2>
			<div className="overflow-y-auto pb-24">
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{data.note.content}
				</p>
			</div>
			<div className={floatingToolbarClassName}>
				<Form method="POST">
					{/* 🐨 add a name="intent" and value="delete" to this button */}
					<Button
						name="intent"
						value="delete"
						type="submit"
						variant="destructive"
					>
						Delete
					</Button>
				</Form>
				<Button asChild>
					<Link to="edit">Edit</Link>
				</Button>
			</div>
		</div>
	)
}
