import * as React from "react";
import { User } from "@prisma/client";
import { setContext } from "@apollo/client/link/context";
import { useLocalStorage } from "react-use";
import { useRouter } from "next/router";
import { useUserQuery } from "~/graphql/types.generated";
import { useTokenStore } from "./TokenProvider";

interface Context {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: any;
}

const authContext = React.createContext<Context>({
	isAuthenticated: false,
	isLoading: true,
	user: undefined,
});

interface Props {
	children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
	const [isAuthenticated, setAuthenticated] = React.useState<boolean>(false);
	const { data: user, isLoading } = useUserQuery(
		{},
		{
			onSuccess: (data) => {
				if (data) {
					setAuthenticated(true);
				}
			},
		},
	);

	return (
		<authContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				user,
			}}>
			{children}
		</authContext.Provider>
	);
}

export function useAuth(isProtected: boolean = false) {
	const value = React.useContext(authContext);
	const router = useRouter();

	React.useEffect(() => {
		if (
			isProtected &&
			!value.isLoading &&
			!value.isAuthenticated &&
			!value.user
		) {
			router.push("/login", {
				query: {
					message: "Could not verify user, please login again.",
				},
			});
		}
	}, [router, value, isProtected]);

	return value;
}
