import { cn } from '#app/utils/misc.tsx'
// eslint-disable-next-line import/order
import { Link, NavLink, Outlet } from '@remix-run/react'

export default function NotesRoute() {
	return (
		<div className="flex h-full justify-between pl-2 pt-1 pb-12 border-8 border-blue-500">
			<div>
				<h1 className="text-h1">Notes</h1>
				{/* 🐨 add two links here.
				One to go back to the parent *path* (💰 not parent "route" that's why you need to use the relative="path" prop)
				and the other to go to the some-note-id route
			*/}
				{/* 💰 feel free to restructure things however you like to make them look nice */}
				<ul className="pl-1">
					<li>
						<Link to=".." relative="path" className="underline">
							Back to Kody
						</Link>
					</li>
					<li>
						{/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
						<NavLink
							to="some-note-id"
							className={({ isActive }) =>
								cn('underline', isActive && 'bg-accent')
							}
						>
							Some Note
						</NavLink>
					</li>
				</ul>
			</div>
			<Outlet />
		</div>
	)
}
