import { UserContext, UserProfile, useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import QueryString from "qs";
import React from "react";

interface UseAuthReturn {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: UserProfile;
}

export function useAuth(
	isProtected: boolean = false,
): Omit<UserContext, "checkSession"> & { isAuthenticated: boolean } {
	const { isLoading, user, error } = useUser();
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	const router = useRouter();

	React.useEffect(() => {
		if (isLoading) return;
		if (!isLoading && typeof user !== "undefined") {
			setIsAuthenticated(true);
		} else {
			if (isProtected)
				router.push(
					"/?" +
						QueryString.stringify({
							message: "Unable to verify user, please login again.",
						}),
				);
		}
	}, [isLoading, isProtected, router, user]);

	return { isAuthenticated, isLoading, user };
}
