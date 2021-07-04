import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import {
	HiOutlineMenu,
	HiOutlineMoon,
	HiOutlineSun,
	HiOutlineX
} from "react-icons/hi";
import { Logo } from "~/components/Logo";
import useDisclosure from "~/hooks/use-disclosure";
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
	const { theme, setTheme } = useTheme();
	const { isOpen, onToggle } = useDisclosure();
	return (
		<div className="top-0 flex flex-col items-center justify-between w-full h-full gap-8 px-4 pt-8 lg:items-start lg:justify-start lg:min-h-screen lg:px-0">
			<div className="flex items-center justify-between w-full">
				<Link href="/docs">
					<a>
						<Logo className="text-black dark:text-white" />
					</a>
				</Link>
				<div className="flex items-center gap-4 mr-2">
					<button
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					>
						{theme === "light" ? (
							<HiOutlineSun className="w-6 h-6" />
						) : (
							<HiOutlineMoon className="w-6 h-6" />
						)}
					</button>
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
				</div>
			)}
		</div>
	);
};

export default Sidebar;
