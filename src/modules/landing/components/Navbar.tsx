import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { Logo } from "~/components/Logo";
import { useAuth } from "~/hooks/use-auth";

export default function Navbar() {
	const { isAuthenticated } = useAuth();
	return (
		<header className="container flex items-center justify-between w-full gap-3 p-5 mx-auto text-gray-600 bg-white shadow-md dark:shadow-none dark:bg-transparent">
			<Link href="/">
				<a className="flex items-center font-medium text-gray-900 title-font">
					<Logo className="text-black dark:text-white" />
				</a>
			</Link>
			<div className="flex items-center gap-5">
				{/* <NavLinks /> */}
				{isAuthenticated ? (
					<Link href="/dashboard">
						<a className="flex items-center px-2 py-2 mt-auto text-sm font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg lg:text-base lg:px-6 hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
							Dashboard
							<HiArrowRight className="w-4 h-4 ml-2" />
						</a>
					</Link>
				) : (
					<>
						<Link href="/login">
							<a className="text-sm text-gray-800 transition hover:text-gray-900 hover:underline dark:text-white lg:text-base">
								Login
							</a>
						</Link>
						<div className="w-[1px] h-5 bg-gray-400"></div>
						<Link href="/register">
							<a className="flex items-center px-2 py-2 mt-auto text-sm font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg lg:text-base lg:px-6 hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
								Sign up
								<HiArrowRight className="w-4 h-4 ml-2" />
							</a>
						</Link>
					</>
				)}
			</div>
		</header>
	);
}
