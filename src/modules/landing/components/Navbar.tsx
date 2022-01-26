import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { HiMenu, HiOutlineDocumentText, HiX } from "react-icons/hi";
import { VscGithub } from "react-icons/vsc";
import { useDisclosure } from "react-sensible";
import CustomLink from "~/components/CustomLink";
import { Logo } from "~/components/Logo";
import useBreakpoints from "~/hooks/use-breakpoints";
import { GetStartedButton } from "./GetStartedButton";

export const Navbar = ({
	className,
	...props
}: JSX.IntrinsicElements["header"]) => {
	const { isOpen, onToggle } = useDisclosure();
	const { isLg } = useBreakpoints();

	React.useEffect(() => {
		if (isLg && isOpen) {
			onToggle();
		}
	}, [isLg, isOpen, onToggle]);

	return (
		<header
			className={clsx([
				"w-full border-b dark:border-gray-700 bg-transparent z-50 backdrop-filter backdrop-blur-lg",
				className,
			])}
			{...props}
		>
			<div className="flex items-center justify-between lg:px-8 h-20 w-full px-4 lg:w-5/6 mx-auto">
				<Link href="/" passHref>
					<a>
						<Logo className="text-black dark:text-white" />
					</a>
				</Link>
				<nav className="flex items-center gap-8">
					<button onClick={onToggle} className="block lg:hidden">
						{isOpen ? (
							<HiX className="h-6 w-6" />
						) : (
							<HiMenu className="h-6 w-6" />
						)}
					</button>
					<CustomLink
						href="https://github.com/arn4v/bookmarky"
						className="hidden rounded-lg dark:text-white font-bold text-gray-700 hover:text-black lg:flex items-center gap-2"
					>
						GitHub
						<VscGithub />
					</CustomLink>
					<CustomLink
						href="/docs"
						className="hidden rounded-lg dark:text-white font-bold text-gray-700 hover:text-black lg:flex items-center gap-2"
					>
						Documentation
						<HiOutlineDocumentText />
					</CustomLink>
					<GetStartedButton className="hidden lg:flex" />
				</nav>
			</div>
			{isOpen ? (
				<div className="w-full backdrop-filter backdrop-blur-lg mb-8">
					<ul className="flex flex-col gap-4">
						<li className="px-6">
							<CustomLink
								data-test="homepage-github-link"
								href="https://github.com/arn4v/bookmarky"
								className="flex items-center px-6 py-2 mt-auto mr-3 font-semibold text-blue-800 transition duration-500 ease-in-out transform bg-blue-100 rounded-lg hover:bg-blue-200 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2 justify-center w-full"
							>
								GitHub
								<VscGithub />
							</CustomLink>
						</li>
						<li className="px-6">
							<CustomLink
								data-test="homepage-documentation-link"
								href="/docs"
								className="flex items-center px-6 py-2 mt-auto mr-3 font-semibold text-blue-800 transition duration-500 ease-in-out transform bg-blue-100 rounded-lg hover:bg-blue-200 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2 justify-center w-full"
							>
								Documentation
								<HiOutlineDocumentText />
							</CustomLink>
						</li>
						<li className="px-6">
							<GetStartedButton />
						</li>
					</ul>
				</div>
			) : null}
		</header>
	);
};
