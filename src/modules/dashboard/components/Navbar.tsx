import Link from "next/link";
import { useRouter } from "next/router";
import { Logo } from "~/components/Logo";
import ProfileDropdown from "~/modules/dashboard/components/ProfileDropdown";
import CreateBookmarkButton from "./CreateButton";
import MenuDrawer from "./MenuDrawer";
import TagsDrawer from "./TagsDrawer";

export default function Navbar() {
	const router = useRouter();

	return (
		<header className="w-full h-20 border-b dark:border-gray-700 fixed dark:bg-black bg-white z-50">
			<div className="flex items-center justify-between w-full h-full px-6 2xl:px-0 mx-auto 2xl:w-3/5">
				<Link href="/app">
					<a className="lg:-ml-1">
						<Logo
							className="text-black fill-current dark:text-white"
							height={Logo.baseHeight * 0.75}
							width={Logo.baseWidth * 0.75}
						/>
					</a>
				</Link>
				<nav>
					<div className="items-center hidden gap-5 lg:flex">
						{/* Only show create button on Dashboard */}
						{router.pathname === "/app" ? (
							<CreateBookmarkButton
								className="text-white border-none"
								showText
							/>
						) : null}
						<ProfileDropdown />
					</div>
					<div className="flex items-center gap-5 lg:hidden">
						{/* Only show create button and tags drawer on Dashboard */}
						{router.pathname === "/app" ? (
							<>
								<CreateBookmarkButton className="text-black bg-transparent dark:text-white hover:bg-transparent" />
								<TagsDrawer />
							</>
						) : null}
						<MenuDrawer />
					</div>
				</nav>
			</div>
		</header>
	);
}
