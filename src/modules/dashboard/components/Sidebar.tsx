import Tags from "./Tags";

const Sidebar = () => {
	return (
		<div className="h-full w-1/4 px-6 shadow-xl dark:shadow-none bg-white dark:bg-transparent border-r border-gray-400 dark:border-gray-700 flex flex-col py-8 gap-6 justify-between items-center">
			<Tags />
		</div>
	);
};

export default Sidebar;
