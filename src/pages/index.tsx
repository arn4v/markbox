import Link from "next/link";
import React from "react";
import { HiArrowRight } from "react-icons/hi";
import { Logo } from "~/components/Logo";
import NextImage from "next/image";
import { useAuth } from "~/hooks/use-auth";
import useBreakpoints from "~/hooks/use-breakpoints";

export default function IndexPage() {
	const { isAuthenticated } = useAuth();
	const { isLg } = useBreakpoints();

	return (
		<div className="w-screen h-screen overflow-hidden from-blue-100 to-white bg-gradient-to-b dark:from-gray-800 dark:to-black">
			<header className="flex items-center justify-between gap-3 p-5 mx-auto text-gray-600 dark:bg-transparent w-5/6">
				<Link href="/">
					<a className="flex items-center font-medium text-gray-900 title-font">
						<Logo className="text-black dark:text-white" />
					</a>
				</Link>
				<div className="flex items-center gap-5">
					{/* <NavLinks /> */}
					{isAuthenticated ? (
						<Link href="/dashboard">
							<a className="flex items-center px-2 py-2 mt-auto text-sm font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg lg:text-base lg:px-6 hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
								Dashboard
								<HiArrowRight className="w-4 h-4 ml-2" />
							</a>
						</Link>
					) : (
						<>
							<a
								className="flex items-center px-2 py-2 mt-auto text-sm font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg lg:text-base lg:px-6 hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
								href="/api/auth/login"
							>
								Log in
								<HiArrowRight className="w-4 h-4 ml-2" />
							</a>
						</>
					)}
				</div>
			</header>
			<section id="hero" className="text-blueGray-700 dark:text-blueGray-200">
				<div className="flex flex-col px-5 pt-16 lg:items-center">
					<div className="flex flex-col w-full text-left lg:mb-8 lg:text-center">
						<h1 className="mb-6 text-2xl font-semibold tracking-tighter text-center text-black dark:text-white sm:text-5xl title-font font-poppins">
							{" "}
							API-first bookmarking tool <br className="md:hidden" /> for
							developers.{" "}
						</h1>
					</div>
					<div className="flex justify-center mb-12">
						{!isAuthenticated ? (
							<>
								<a
									href="/api/auth/login"
									aria-label="login"
									title="Login"
									className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2"
								>
									Starting bookmarking for free <HiArrowRight />
								</a>
							</>
						) : (
							<Link href="/dashboard">
								<a className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2">
									Starting bookmarking for free <HiArrowRight />
								</a>
							</Link>
						)}
					</div>
					<div className="flex items-center justify-center w-full">
						<div className="overflow-hidden rounded-lg ring-2 ring-gray-400">
							{isLg ? (
								<NextImage
									src="/static/dashboard-desktop.png"
									alt="Bookmarky dashboard "
									height={687}
									width={1200}
								/>
							) : (
								<NextImage
									src="/static/dashboard-mobile.png"
									alt="Bookmarky dashboard "
									height={823}
									width={411}
								/>
							)}
						</div>
					</div>
				</div>
			</section>
			<footer className="fixed bottom-0 flex items-center justify-between w-full p-3 text-gray-400 bg-black dark:bg-gray-900 body-font">
				<div className="flex flex-col items-start justify-start md:items-center md:flex-row">
					<a className="flex items-center justify-center font-medium text-white title-font md:justify-start">
						<Logo className="text-white" />
					</a>
					<p className="text-sm text-gray-400 sm:border-l-2 sm:border-gray-800 sm:py-2 sm:mt-0">
						© 2021 Arnav Gosain —
						<a
							href="https://twitter.com/knyttneve"
							className="ml-1 text-gray-500"
							target="_blank"
							rel="noopener noreferrer"
						>
							arn4v
						</a>
					</p>
				</div>
				<span className="inline-flex justify-center">
					<a
						className="ml-3 text-gray-400 transition hover:text-gray-200"
						target="_blank"
						rel="noopener noreferrer"
						href="https://twitter.com/arn4v"
					>
						<svg
							fill="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="w-5 h-5"
							viewBox="0 0 24 24"
						>
							<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
						</svg>
					</a>
				</span>
			</footer>
		</div>
	);
}
