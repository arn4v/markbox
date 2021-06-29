import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import * as React from "react";
import { HiChevronRight } from "react-icons/hi";

type ItemCommonProps = {
	name: string;
};

type Item = ItemCommonProps &
	(
		| {
				type: "button";
				onClick: () => void;
		  }
		| {
				type: "link";
				href: LinkProps["href"];
		  }
	);

interface Props {
	itemClassName?: string;
	items: Item[];
}

export default function Breadcrumbs({ items, itemClassName = "" }: Props) {
	return (
		<div className="flex items-center gap-2">
			{items.map((data, idx) => {
				return (
					<>
						{idx !== 0 && idx !== items.length && <HiChevronRight />}
						{data.type === "button" && (
							<button onClick={data.onClick} className={clsx([itemClassName])}>
								{data.name}
							</button>
						)}
						{data.type === "link" && (
							<Link href={data.href}>
								<a className={clsx([itemClassName])}>{data.name}</a>
							</Link>
						)}
					</>
				);
			})}
		</div>
	);
}
