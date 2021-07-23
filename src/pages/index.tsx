import clsx from "clsx";
import Link from "next/link";
import React from "react";
import {
	HiArrowRight,
	HiMenu,
	HiOutlineDocumentText,
	HiX,
} from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import { Typewriter } from "react-simple-typewriter";
import { Logo } from "~/components/Logo";
import { useAuth } from "~/hooks/use-auth";
import useBreakpoints from "~/hooks/use-breakpoints";

const GetStartedButton = ({ className = "" }) => {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? (
		<>
			<Link href="/dashboard">
				<a
					className={clsx(
						"flex items-center justify-center px-2 lg:px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2",
						className,
					)}
				>
					Dashboard <HiArrowRight />
				</a>
			</Link>
		</>
	) : (
		<>
			<a
				className={clsx(
					"items-center px-2 w-full flex items-center justify-center lg:px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2",
					className,
				)}
				href="/api/auth/login"
			>
				Get started
				<HiArrowRight />
			</a>
		</>
	);
};

export default function IndexPage() {
	const { isAuthenticated } = useAuth();
	const { isOpen, onToggle } = useDisclosure();
	const { isLg } = useBreakpoints();

	React.useEffect(() => {
		if (isLg && isOpen) {
			onToggle();
		}
	}, [isLg, isOpen, onToggle]);

	return (
		<div className="min-h-screen w-screen dark:bg-black relative">
			<header className="sticky top-0 w-full border-b dark:border-gray-700 bg-transparent z-50 backdrop-filter backdrop-blur-lg">
				<div className="flex items-center justify-between lg:px-8 h-20 w-full px-4 lg:w-5/6 mx-auto">
					<Logo className="text-black dark:text-white" />
					<nav className="flex items-center gap-6">
						<button onClick={onToggle} className="block lg:hidden">
							{isOpen ? (
								<HiX className="h-6 w-6" />
							) : (
								<HiMenu className="h-6 w-6" />
							)}
						</button>
						<Link href="/docs">
							<a className="hidden rounded-lg lg:block dark:text-white font-bold text-gray-700 hover:text-black">
								Docs
							</a>
						</Link>
						<GetStartedButton className="hidden lg:flex" />
					</nav>
				</div>
				{isOpen ? (
					<div className="w-full backdrop-filter backdrop-blur-lg mb-8">
						<ul className="flex flex-col">
							<li className="px-6">
								<Link href="/docs">
									<a
										className="flex items-center px-6 py-2 mt-auto mr-3 font-semibold text-blue-800 transition duration-500 ease-in-out transform bg-blue-100 rounded-lg hover:bg-blue-200 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2 justify-center w-full"
										href="/api/auth/login"
									>
										Docs
										<HiOutlineDocumentText />
									</a>
								</Link>
							</li>
							<li className="px-6 mt-4">
								<GetStartedButton />
							</li>
						</ul>
					</div>
				) : null}
			</header>
			<div className="w-96 h-64 blur-[350px] absolute bg-sky-400 rounded-full top-1/3 left-1/2 -translate-x-1/2 transform"></div>
			<section className="dark:text-blueGray-200 text-blueGray-700 container flex flex-col gap-12 px-5 py-8 lg:py-24 mx-auto items-center">
				<div className="flex flex-col w-full text-left lg:text-center">
					<h2 className="mb-4 text-xs font-semibold tracking-widest text-black dark:text-white uppercase text-center">
						API-first bookmarking for Developers
					</h2>
					<h1 className="mb-6 text-4xl font-semibold tracking-tighter dark:text-white text-black sm:text-5xl font-poppins text-center">
						Bookmark from your
						<br className="md:hidden" />{" "}
						<span className="text-blue-500">
							<Typewriter
								words={["browser", "terminal", "chrome extension"]}
								cursorStyle="_"
								typeSpeed={70}
								loop
							/>
						</span>
						.
					</h1>
					<p className="mx-auto text-base font-medium leading-relaxed dark:text-blueGray-200 text-blueGray-700 lg:w-1/3 text-center">
						Bookmarky is an alternative to in-browser bookmark manager with
						focus on extending it for your own needs.
						<br />
						<br />
						Want to bookmark with your friends on Discord? Build your own bot
						and use the Bookmarky API to store data.
					</p>
				</div>
				{!isAuthenticated ? (
					<div className="flex justify-left lg:justify-center">
						<a
							className="flex items-center px-6 py-2 mt-auto mr-3 font-semibold text-blue-800 transition duration-500 ease-in-out transform bg-blue-100 rounded-lg hover:bg-blue-200 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
							href="/api/auth/login"
						>
							Login
						</a>
						<a
							className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
							href="/api/auth/signup"
						>
							Sign up
						</a>
					</div>
				) : null}
				<div className="flex items-center w-full lg:px-0 lg:w-3/4 justify-between blur-none object-contain">
					<img
						src="/static/hero-desktop.png"
						alt="Mockup"
						className="object-contain hidden lg:block"
					/>
					<img
						src="/static/hero-mobile.png"
						alt="Mockup"
						className="object-contain lg:hidden"
					/>
				</div>
			</section>
		</div>
	);
}
