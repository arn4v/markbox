import { Logo } from "~/components/Logo";
import ProfileDropdown from "~/modules/common/components/ProfileDropdown";
import CreateBookmarkButton from "./CreateBookmarkButton";

export default function Navbar() {
	return (
		<header className="w-full h-20 border-b dark:border-blueGray-700">
			<div className="h-full w-3/5 mx-auto flex items-center justify-between">
				<Logo className="fill-current text-black dark:text-white" />
				<nav className="flex items-center gap-4">
					<CreateBookmarkButton />
					<ProfileDropdown />
				</nav>
			</div>
		</header>
	);
}
