import React from "react";
import { HiOutlineCog, HiOutlineHome, HiOutlineViewGrid } from "react-icons/hi";
import { Logo } from "~/components/Logo";
import { SidebarItem } from "./SidebarItem";
import { SidebarTagsList } from "./SidebarTagsList";

const Sidebar = () => {
	return (
		<>
			<style jsx scoped>
				{`
					.sidebar {
						height: calc(100vh - 5rem);
					}
				`}
			</style>
			<div className="hidden lg:block gap-6 bg-white lg:w-72 overflow-y-scroll scrollbar-track-gray-100 scrollbar-thumb-gray-300 scrollbar scrollbar-thin fixed h-full shadow-lg">
				<div className="h-auto w-full flex flex-col rounded-r-lg bg-white">
					<Logo className="max-w-[150px] mt-6 ml-6" />
					<ul className="w-full flex flex-col space-y-4 mt-8 px-6">
						<SidebarItem
							title="Bookmarks"
							icon={<HiOutlineHome className="h-5 w-5" />}
							href="/app"
						/>
						<SidebarItem
							title="Collections"
							icon={<HiOutlineViewGrid className="h-5 w-5" />}
							href="/collections"
						/>
						<SidebarItem
							title="Collections"
							icon={<HiOutlineCog className="h-5 w-5" />}
							href="/settings"
						/>
					</ul>
					<div className="w-full bg-neutral-300 h-[2px] my-8" />
					<SidebarTagsList />
				</div>
			</div>
		</>
	);
};

export default Sidebar;
