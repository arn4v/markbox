import Link from "next/link";
import { HiArrowRight, HiChevronRight } from "react-icons/hi";
import { Logo } from "~/components/Logo";
import { useAuth } from "~/hooks/use-auth";

export default function Navbar() {
	const { isAuthenticated } = useAuth();
	return (
		<header className="text-gray-600 container mx-auto flex flex-wrap p-5 flex-col gap-3 md:flex-row items-center">
			<Link href="/">
				<a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
					<Logo className="text-black" />
				</a>
			</Link>
			<nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
				<a className="mr-5 hover:text-gray-900">Docs</a>
				<a className="mr-5 hover:text-gray-900">Features</a>
				<a className="mr-5 hover:text-gray-900">FAQ</a>
			</nav>

			{isAuthenticated ? (
				<Link href="/dashboard">
					<a className="inline-flex items-center bg-indigo-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 transition rounded text-base mt-4 md:mt-0">
						Dashboard
						<HiArrowRight className="h-3 w-3 ml-2" />
					</a>
				</Link>
			) : (
				<>
					<Link href="/login">
						<a className="text-gray-800 hover:text-gray-900 transition hover:underline">
							Login
						</a>
					</Link>
					<div className="w-[1px] h-5 bg-gray-400"></div>
					<Link href="/register">
						<a className="inline-flex items-center bg-indigo-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 transition rounded text-base mt-4 md:mt-0">
							Sign up
							<HiArrowRight className="h-3 w-3 ml-2" />
						</a>
					</Link>
				</>
			)}
		</header>
	);
}
