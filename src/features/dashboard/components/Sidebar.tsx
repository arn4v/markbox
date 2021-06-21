import { Logo } from "~/components/Logo";
import CreateBookmarkButton from "../../create/components/CreateBookmarkButton";
import ProfileDropdown from "./ProfileDropdown";

const Sidebar = () => {
	return (
		<div className="flex items-start justify-end w-1/4 h-full pt-12 pb-8 pr-6 border-r border-blueGray-600">
			<div className="flex flex-col justify-between w-1/2 h-full">
				<div className="flex flex-col w-full gap-6 font-medium dark:text-white">
					<Logo className="my-1.5" />
					<CreateBookmarkButton />
				</div>
				<ProfileDropdown />
			</div>
		</div>
	);
};

export default Sidebar;
