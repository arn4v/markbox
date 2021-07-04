import Link from "next/link";
import { useRouter } from "next/router";
import { Logo } from "~/components/Logo";
import useBreakpoints from "~/hooks/use-breakpoints";
import ProfileDropdown from "~/modules/common/components/ProfileDropdown";
import CreateBookmarkButton from "./CreateBookmark/CreateBookmarkButton";
import MenuDrawer from "./MenuDrawer";
import TagsDrawer from "./TagsDrawer";

export default function Navbar() {
	const { isLg } = useBreakpoints();
	const router = useRouter();

	return (
		<header className="w-full h-20 border-b dark:border-gray-700">
			<div className="flex items-center justify-between w-full h-full px-6 mx-auto 2xl:px-0 2xl:w-3/5">
				<Link href="/dashboard">
					<a>
						<Logo className="text-black fill-current dark:text-white" />
					</a>
				</Link>
				<nav>
					<div className="flex items-center gap-5">
						{isLg ? (
							<>
								{router.pathname === "/dashboard" && (
									<CreateBookmarkButton
										className="text-white border-none"
										showText
									/>
								)}
								<ProfileDropdown />
							</>
						) : (
							<>
								{router.pathname === "/dashboard" && (
									<>
										<CreateBookmarkButton className="text-black bg-transparent dark:text-white hover:bg-transparent" />
										<TagsDrawer />
									</>
								)}
								<MenuDrawer />
							</>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
}
