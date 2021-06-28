import TagList from "./TagList";

const Sidebar = () => {
	return (
		<div className="h-full w-1/4 shadow-xl dark:shadow-none bg-white dark:bg-transparent border-r border-gray-400 dark:border-gray-700 flex-col py-8 gap-6 justify-between items-center px-6 2xl:px-0 2xl:pr-6 hidden lg:flex">
			<TagList />
		</div>
	);
};

export default Sidebar;
