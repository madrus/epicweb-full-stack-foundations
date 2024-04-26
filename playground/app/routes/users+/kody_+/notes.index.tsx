/**
 * This index route will be rendered if the user has no notes
 */
export default function NotesIndexRoute() {
	return (
		<div className="container pt-12 border-8 border-purple-500">
			<p className="text-body-md">Select a note</p>
		</div>
	)
}
