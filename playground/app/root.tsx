import { cssBundleHref } from '@remix-run/css-bundle'
import { type LinksFunction, json } from '@remix-run/node'
import { Link, Links, LiveReload, Outlet, Scripts, useLoaderData } from '@remix-run/react'
import os from 'node:os'
import faviconAssetUrl from './assets/favicon.svg'
import { EpicShop } from './epicshop.tsx'
import fontStylesheetUrl from './styles/font.css'
import tailwindStylesheetUrl from './styles/tailwind.css'

export const links: LinksFunction = () => {
	return [
		{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
		{ rel: 'stylesheet', href: fontStylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}

export async function loader() {
	return json({ username: os.userInfo().username })
}

export default function App() {
	const data = useLoaderData<typeof loader>()
	return (
		<html lang="en" className="h-full overflow-x-hidden">
			<head>
				<Links />
			</head>
			<body className="flex h-full flex-col justify-between bg-background text-foreground">
				<header className="container mx-auto py-6">
					<nav className="flex justify-between">
						<Link to="/">
							<div className="font-light">epic</div>
							<div className="font-bold">notes</div>
						</Link>
						<Link className="underline" to="users/kody/notes">
							Kody's Notes
						</Link>
					</nav>
				</header>

				<div className="flex-1">
					<Outlet />
				</div>

				<div className="container mx-auto flex justify-between">
					<Link to="/">
						<div className="font-light">epic</div>
						<div className="font-bold">notes</div>
					</Link>
					<p>Built with ♥️ by {data.username}</p>
				</div>
				<div className="h-5" />
				{/* 🐨 add the <Scripts /> component from '@remix-run/react' */}
				<Scripts />
				{/* To improve the development experience, we've got some components we can render here as well: */}
				{/* 💯 add the <EpicShop /> component from './epicshop.tsx' */}
				{/* This is responsible for keeping the iframe in sync with the KCD Workshop App */}
				<EpicShop />
				{/* 💯 add the <LiveReload /> component from '@remix-run/react' */}
				{/* This is responsible for updating the app whenever you make code changes (HMR/HDR etc). */}
				<LiveReload />
			</body>
		</html>
	)
}
