import { json, type LoaderFunctionArgs } from '@remix-run/node'
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

export default function NoteEdit() {
	const data = useLoaderData<typeof loader>()

	// 💣 remove this so we can return our form instead
	// return <pre>{JSON.stringify(data, null, 2)}</pre>

	// 🐨 render a Remix Form with the method of "post"
	// 🐨 render an <label> with the text "Title" and an <input> with the name "title" and defaultValue of data.note.title
	// 🐨 render an <label> with the text "Content" and an <textarea> with the name "content" and defaultValue of data.note.content
	// 🐨 render a button with the text "Submit"
	return (
		<Form
			method="post"
			className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
		>
			<div className="flex flex-col gap-1">
				<div>
					<Label>Title</Label>
					<Input name="title" defaultValue={data.note.title} />
				</div>
				<div>
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

	// 💯 as extra credit, you can add a reset button (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
	// 💯 as extra credit, you can use the Label, Input, Textarea, and Button components from '#app/components/ui/*.tsx'
	// 💯 as extra credit, style it nicely with some tailwind classes to give it some space.
	// 💯 if you *really* have extra time, you can wrap the submit and reset buttons in a div with floatingToolbarClassName from '#app/components/floating-toolbar.tsx' and make that look nice.
}
