import clsx from "clsx";
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { isProd } from "~/config";

const SidebarItem = ({
	href,
	children,
}: {
	href: LinkProps["href"];
	children: React.ReactNode;
}) => {
	const router = useRouter();
	const active = router.pathname === href;
	return (
		<Link href={href}>
			<a
				className={clsx([
					"px-4 py-2 w-full transition focus:outline-none hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600 font-medium",
					active &&
						"border-l-4 border-gray-400 bg-gray-300 dark:bg-gray-600 dark:border-blueGray-400",
				])}
			>
				{children}
			</a>
		</Link>
	);
};

type Data = Record<
	string,
	{
		id: string;
		visible: boolean;
		items: { id: string; href: string; title: string }[];
	}
>;

const data: Data = {
	"Account Settings": {
		id: "45b0dc21-ab95-40ca-a5ee-274d6b34882a",
		items: [
			{
				id: "bb2f223f-287a-442c-9b60-8bb2db035fd9",
				href: "/settings/account",
				title: "Profile",
			},
		],
		visible: true,
	},
	"Data Settings": {
		id: "9440efa0-8602-4bfb-a6c6-c047e8969a27",
		items: [
			{
				id: "661cedaa-4943-4f55-8a87-4a24fd697ae2",
				href: "/settings/data/import",
				title: "Import",
			},
			{
				id: "810c4c7d-bd03-43d0-8a65-7f450848b571",
				href: "/settings/data/export",
				title: "Export",
			},
		],
		visible: true,
	},
	"Developer settings": {
		id: "0738885e-ba67-4cf6-a4a4-6936f4479d43",
		items: [
			{
				id: "32c012ae-8066-4781-a332-33fa28ca5246",
				href: "/settings/tokens",
				title: "Tokens",
			},
			{
				id: "b6afc66d-8ae2-4a40-a685-9894ffd3641e",
				href: "/settings/tokens/new",
				title: "Generate new token",
			},
		],
		visible: true,
	},
};

const Sidebar: Component = () => {
	return (
		<div className="w-full lg:w-1/4 flex flex-col space-y-4">
			{Object.entries(data)
				.filter(([_, { visible }]) => (isProd ? visible : true))
				.map(([title, { id, items, visible }]) => {
					return (
						<div
							id="wrapper"
							key={id}
							className="flex flex-col w-full overflow-hidden text-sm bg-gray-100 rounded-lg dark:bg-gray-900"
						>
							<div className="w-full px-4 py-2">
								<span className="font-medium dark:text-gray-200">{title}</span>
							</div>
							<span className="w-full h-px dark:bg-gray-500 bg-gray-300" />
							<div className="flex flex-col w-full">
								{items.map(({ href, id, title }, index, array) => {
									const showDivider = index !== array.length - 1;

									return (
										<>
											<SidebarItem key={id} href={href}>
												{title}
											</SidebarItem>
											{showDivider ? (
												<span className="h-px dark:bg-gray-500" />
											) : null}
										</>
									);
								})}
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default Sidebar;
