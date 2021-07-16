import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useAuth } from "~/hooks/use-auth";

function AuthButton({
	className = "",
	icon,
	iconPosition = "right",
}: {
	className?: string;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
}) {
	const { isAuthenticated } = useAuth();
	return (
		<Link href={isAuthenticated ? "/dashboard" : "/api/auth/login"}>
			<a
				className={clsx([
					"flex items-center gap-2 px-2 py-2 font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 ring-offset-2 ring-offset-current",
					className,
				])}
			>
				{iconPosition === "left" && <>{icon ?? <HiArrowLeft />}</>}
				{isAuthenticated ? "Dashboard" : "Login"}
				{iconPosition === "right" && <>{icon ?? <HiArrowRight />}</>}
			</a>
		</Link>
	);
}

export default AuthButton;
