import { Logo } from "~/components/Logo";

export default function Footer() {
	return (
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
	);
}
