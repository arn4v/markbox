import { Logo } from "~/components/Logo";
import useBreakpoints from "~/hooks/use-breakpoints";
import ProfileDropdown from "~/modules/common/components/ProfileDropdown";
import CreateBookmarkButton from "./CreateBookmarkButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
	const { isLg } = useBreakpoints();

	return (
		<header className="w-full h-20 border-b dark:border-blueGray-700">
			<div className="h-full w-full px-6 2xl:px-0 2xl:w-3/5 mx-auto flex items-center justify-between">
				<Logo className="fill-current text-black dark:text-white" />
				<nav>
					<div className="flex items-center gap-4">
						{isLg ? (
							<>
								<CreateBookmarkButton />
								<ProfileDropdown />
							</>
						) : (
							<MobileMenu />
						)}
					</div>
				</nav>
			</div>
		</header>
	);
}
