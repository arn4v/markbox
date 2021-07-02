import TagList from "./TagList";

const Sidebar = () => {
	return (
		<div className="flex-col items-center justify-between hidden w-1/4 h-full gap-6 px-6 py-8 bg-white border-r border-gray-200 dark:bg-transparent dark:border-gray-700 2xl:px-0 2xl:pr-6 lg:flex">
			<TagList />
		</div>
	);
};

export default Sidebar;
