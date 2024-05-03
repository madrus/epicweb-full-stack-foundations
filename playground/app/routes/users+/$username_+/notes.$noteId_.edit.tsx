import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'

import { floatingToolbarClassName } from '#app/components/floating-toolbar.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { Textarea } from '#app/components/ui/textarea.tsx'
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
	const formData = await request.formData()
	const title = formData.get('title')
	const content = formData.get('content1')
	// 🐨 add a check to make certain that title and content are both a string
	// if they are not, throw an error
	if (typeof title !== 'string') {
		// 💯 as an extra credit, throw a more descriptive 400 Response instead of an error
		throw new Response('The value of Title should be a string', { status: 400 })
	}
	if (typeof content !== 'string') {
		// 💯 as an extra credit, try using the invariantResponse function from "#app/utils/misc.ts"
		invariantResponse(content, 'The value of Content should be a string', {
			status: 400,
		})
	}

	db.note.update({
		where: { id: { equals: params.noteId } },
		data: { title, content: typeof content === 'string' ? content : '' }, // this works
		// data: { title, content }, // this gives an error: "Type 'string | File' is not assignable to type 'string'"
	})

	return redirect(`/users/${params.username}/notes/${params.noteId}`)
}

export default function NoteEdit() {
	const data = useLoaderData<typeof loader>()

	return (
		<Form
			method="POST"
			className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
		>
			<div className="flex flex-col gap-1">
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label>Title</Label>
					<Input name="title" defaultValue={data.note.title} />
				</div>
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label>Content</Label>
					<Textarea name="content" defaultValue={data.note.content} />
				</div>
			</div>
			<div className={floatingToolbarClassName}>
				<Button variant="destructive" type="reset">
					Reset
				</Button>
				<Button type="submit">Submit</Button>
			</div>
		</Form>
	)
}
