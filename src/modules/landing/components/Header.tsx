import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import NextImage from "~/components/NextImage";
import { useAuth } from "~/hooks/use-auth";
import useBreakpoints from "~/hooks/use-breakpoints";

const Header = () => {
	const { isLg } = useBreakpoints();
	const { isAuthenticated } = useAuth();

	return (
		<section className="text-blueGray-700 dark:text-blueGray-200">
			<div className="container flex flex-col px-5 pt-16 mx-auto lg:items-center">
				<div className="flex flex-col w-full text-left lg:mb-8 lg:text-center">
					<h1 className="mb-6 text-2xl font-semibold tracking-tighter text-center text-black dark:text-white sm:text-5xl title-font">
						{" "}
						API-first bookmarking tool <br className="md:hidden" /> for
						developers.{" "}
					</h1>
				</div>
				<div className="flex justify-center mb-12">
					{!isAuthenticated ? (
						<>
							<Link href="/login">
								<a className="flex items-center px-6 py-2 mt-auto mr-3 font-semibold text-blue-800 transition duration-500 ease-in-out transform bg-blue-100 rounded-lg hover:bg-blue-200 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
									Login
								</a>
							</Link>
							<Link href="/signup">
								<a className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
									Sign up
								</a>
							</Link>
						</>
					) : (
						<Link href="/dashboard">
							<a className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
								Dashboard <HiArrowRight />
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
	);
};

export default Header;
