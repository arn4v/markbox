import { Logo } from "~/components/Logo";
import ProfileDropdown from "~/modules/common/components/ProfileDropdown";
import CreateBookmarkButton from "./CreateBookmarkButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
	return (
		<header className="w-full h-20 border-b dark:border-blueGray-700">
			<div className="h-full w-full px-6 2xl:px-0 2xl:w-3/5 mx-auto flex items-center justify-between">
				<Logo className="fill-current text-black dark:text-white" />
				<nav>
					<div className="items-center gap-4 hidden lg:flex">
						<CreateBookmarkButton />
						<ProfileDropdown />
					</div>
					<div className="flex items-center lg:hidden gap-4">
						<MobileMenu></MobileMenu>
					</div>
				</nav>
			</div>
		</header>
	);
}
