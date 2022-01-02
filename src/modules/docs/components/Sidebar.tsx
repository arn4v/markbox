import Link from "next/link";
import React from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import { Logo } from "~/components/Logo";
import AuthButton from "./AuthButton";
import SidebarSection from "./SidebarSection";

const sidebarData: Category[] = [
	{
		title: "General",
		children: [
			{
				title: "Introduction",
				href: "/docs/introduction",
			},
			{
				title: "Saving browser tab using bookmarklet",
				href: "/docs/bookmarklet",
			},
			{
				title: "Roadmap",
				href: "/docs/roadmap",
			},
			{
				title: "Contributing",
				href: "/docs/contributing",
			},
			{
				title: "Data Models",
				href: "/docs/models",
			},
			{
				title: "Generate Tokens",
				href: "/docs/generate-tokens",
			},
		],
	},
	{
		title: "API",
		children: [
			{
				title: "bookmarks",
				href: "/docs/v1/bookmarks",
			},
			{
				title: "tags",
				href: "/docs/v1/tags",
			},
		],
	},
];

const Sidebar = () => {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<div className="top-0 z-50 flex flex-col items-center justify-between w-full h-full gap-8 px-4 py-4 lg:pt-8 lg:items-start lg:justify-start lg:min-h-screen lg:px-0">
			<div className="flex items-center justify-between w-full">
				<Link href="/docs">
					<a>
						<Logo className="text-black dark:text-white" />
					</a>
				</Link>
				<div className="flex items-center gap-4 mr-2">
					<button onClick={onToggle} className="lg:hidden">
						{isOpen ? (
							<HiOutlineX className="w-6 h-6" />
						) : (
							<HiOutlineMenu className="w-6 h-6" />
						)}
					</button>
				</div>
			</div>
			<div className="flex-col hidden w-full gap-8 lg:flex">
				{sidebarData.map((data) => {
					return <SidebarSection key={data.title} data={data} />;
				})}
			</div>
			{isOpen && (
				<div className="flex flex-col w-full gap-8 lg:hidden">
					{sidebarData.map((data) => {
						return <SidebarSection key={data.title} data={data} />;
					})}
					<AuthButton className="flex justify-center lg:hidden" />
				</div>
			)}
		</div>
	);
};

export default Sidebar;
