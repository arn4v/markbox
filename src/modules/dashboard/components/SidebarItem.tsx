import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

export interface SidebarItemProps {
	href: LinkProps["href"];
	icon: React.ReactNode;
	title: string;
}

export const SidebarItem: React.VFC<SidebarItemProps> = ({
	href,
	icon,
	title,
}) => {
	const router = useRouter();
	return (
		<li className="w-full">
			<Link href={href} passHref>
				<a
					className={clsx([
						"min-w-[100%] transition inline-flex items-center space-x-4 text-lg font-medium",
						router.pathname === href
							? "text-black"
							: "text-neutral-500 hover:text-black",
					])}
				>
					{icon}
					<span>{title}</span>
				</a>
			</Link>
		</li>
	);
};
