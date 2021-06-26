import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface TagProps {
	children: string;
	redirect?: boolean;
}

export default function Tag({ children, redirect = true }: TagProps) {
	const router = useRouter();

	return (
		<Link
			href={{
				href: "/dashboard",
				query: redirect
					? {
							tag: encodeURIComponent(children.toLowerCase()),
					  }
					: {},
			}}
			shallow={true}>
			<a
				className={clsx([
					"px-4 py-2 w-full transition rounded-md",
					typeof router.query.tag === "undefined"
						? "bg-blueGray-600"
						: "bg-blueGray-700 hover:bg-blueGray-600",
				])}>
				{children}
			</a>
		</Link>
	);
}
