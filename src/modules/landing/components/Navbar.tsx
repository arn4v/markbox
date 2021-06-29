import Link from "next/link";
import { HiArrowRight, HiChevronRight } from "react-icons/hi";
import { Logo } from "~/components/Logo";
import { useAuth } from "~/hooks/use-auth";
import NavLinks from "./NavLinks";

export default function Navbar() {
	const { isAuthenticated } = useAuth();
	return (
		<header className="container flex flex-col flex-wrap items-center gap-3 p-5 mx-auto text-gray-600 md:flex-row">
			<Link href="/">
				<a className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0">
					<Logo className="text-black" />
				</a>
			</Link>
			{/* <NavLinks /> */}
			{isAuthenticated ? (
				<Link href="/dashboard">
					<a className="inline-flex items-center px-3 py-1 mt-4 text-base text-white transition bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600 md:mt-0">
						Dashboard
						<HiArrowRight className="w-3 h-3 ml-2" />
					</a>
				</Link>
			) : (
				<>
					<Link href="/login">
						<a className="text-gray-800 transition hover:text-gray-900 hover:underline">
							Login
						</a>
					</Link>
					<div className="w-[1px] h-5 bg-gray-400"></div>
					<Link href="/register">
						<a className="inline-flex items-center px-3 py-1 mt-4 text-base text-white transition bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600 md:mt-0">
							Sign up
							<HiArrowRight className="w-3 h-3 ml-2" />
						</a>
					</Link>
				</>
			)}
		</header>
	);
}
