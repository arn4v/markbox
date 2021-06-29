import Link from "next/link";
import { Logo } from "~/components/Logo";
import useBreakpoints from "~/hooks/use-breakpoints";
import ProfileDropdown from "~/modules/common/components/ProfileDropdown";
import CreateBookmarkButton from "./CreateBookmark/CreateBookmarkButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
	const { isLg } = useBreakpoints();

	return (
		<header className="w-full h-20 border-b dark:border-blueGray-700">
			<div className="flex items-center justify-between w-full h-full px-6 mx-auto 2xl:px-0 2xl:w-3/5">
				<Link href="/dashboard">
					<a>
						<Logo className="text-black fill-current dark:text-white" />
					</a>
				</Link>
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
