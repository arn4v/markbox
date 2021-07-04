import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const SidebarSection = ({ data }: { data: Category }) => {
	const router = useRouter();
	const slug = "/docs/" + (router.query.slug as string[]).join("/");

	return (
		<nav className="flex flex-col items-start justify-start gap-2">
			<h2 className="block font-semibold">{data.title}</h2>
			<ul className="flex flex-col w-full gap-2 lg:pl-4">
				{data.children.map((child) => {
					return (
						<li key={`${data.title}-${child.title}`}>
							<Link href={child.href}>
								<a
									className={clsx([
										"block py-1 px-2 rounded-md lg:rounded-none lg:rounded-l-md",
										slug === child.href
											? "bg-blue-100 dark:bg-blue-200 border-r-4 border-blue-600 dark:border-blue-700 font-medium text-black"
											: "hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700 bg-gray-100",
									])}
								>
									{child.title}
								</a>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default SidebarSection;
