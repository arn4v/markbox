import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { useAuth } from "~/hooks/use-auth";
import { Navbar } from "~/modules/landing/components/Navbar";

export default function IndexPage() {
	const { isAuthenticated } = useAuth();

	return (
		<div className="min-h-screen w-screen dark:bg-black relative">
			<Navbar />
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
							data-test="homepage-login-link"
							className="flex items-center px-6 py-2 mt-auto mr-3 font-semibold text-blue-800 transition duration-500 ease-in-out transform bg-blue-100 rounded-lg hover:bg-blue-200 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
							href="/api/auth/login"
						>
							Login
						</a>
						<a
							data-test="homepage-signup-link"
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
