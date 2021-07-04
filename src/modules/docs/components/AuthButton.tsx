import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { HiArrowRight } from "react-icons/hi";
import { useAuth } from "~/hooks/use-auth";

function AuthButton({ className }: { className: string }) {
	const { isAuthenticated } = useAuth();
	return (
		<Link href={isAuthenticated ? "/dashboard" : "/login"}>
			<a
				className={clsx([
					"flex items-center gap-2 px-2 py-2 ml-auto font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 ring-offset-2 ring-offset-current",
					className,
				])}
			>
				{isAuthenticated ? "Dashboard" : "Login"} <HiArrowRight />
			</a>
		</Link>
	);
}

export default AuthButton;
