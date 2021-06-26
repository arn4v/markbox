import TagList from "./TagList";

const Sidebar = () => {
	return (
		<div className="h-full w-1/4 shadow-xl dark:shadow-none bg-white dark:bg-transparent border-r border-gray-400 dark:border-gray-700 flex flex-col py-8 gap-6 justify-between items-center">
			<TagList />
		</div>
	);
};

export default Sidebar;
