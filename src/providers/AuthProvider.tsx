import * as React from "react";
import { useRouter } from "next/router";
import qs from "qs";
import { UserQuery, useUserQuery } from "~/graphql/types.generated";
import ms from "ms";

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
	const [user, setUser] =
		React.useState<Omit<UserQuery["user"], "__typename">>(undefined);
	const { isLoading } = useUserQuery(
		{},
		{
			refetchInterval: ms("5s"),
			onSuccess: (data) => {
				if (!!data.user) {
					setAuthenticated(!!data.user);
					setUser(data.user);
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
			router.push(
				"/login?" +
					qs.stringify({
						message: "Could not verify user, please login again.",
					}),
			);
		}
	}, [router, value, isProtected]);

	return value;
}
