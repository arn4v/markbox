import Link from "next/link";
import { Logo } from "~/components/Logo";

export default function Navbar() {
	return (
		<header className="text-gray-600 container mx-auto flex flex-wrap p-5 flex-col gap-3 md:flex-row items-center">
			<Link href="/">
				<a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
					<Logo className="text-black" />
				</a>
			</Link>
			<nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
				<a className="mr-5 hover:text-gray-900">First Link</a>
				<a className="mr-5 hover:text-gray-900">Second Link</a>
				<a className="mr-5 hover:text-gray-900">Third Link</a>
				<a className="mr-5 hover:text-gray-900">Fourth Link</a>
			</nav>
			<Link href="/login">
				<a className="text-gray-800 hover:text-gray-900 transition hover:underline">Login</a>
			</Link>
			<div className="w-[1px] h-5 bg-gray-400"></div>
			<Link href="/signup">
				<a className="inline-flex items-center bg-indigo-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 transition rounded text-base mt-4 md:mt-0">
					Sign up
					<svg
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						className="w-4 h-4 ml-1"
						viewBox="0 0 24 24">
						<path d="M5 12h14M12 5l7 7-7 7"></path>
					</svg>
				</a>
			</Link>
		</header>
	);
}
