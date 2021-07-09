import { useRouter } from "next/router";
import QueryString from "qs";
import create from "zustand";
import { User, useUserQuery } from "~/graphql/types.generated";

interface UseAuthReturn {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: User;
}

interface State extends Omit<UseAuthReturn, "isLoading"> {
	setState(partial: Omit<UseAuthReturn, "isLoading">): void;
}

const useAuthStore = create<State>((set) => ({
	isAuthenticated: false,
	user: undefined,
	setState(partial) {
		set(partial);
	},
}));

export function useAuth(isProtected: boolean = false): UseAuthReturn {
	const { isAuthenticated, user, setState } = useAuthStore();
	const router = useRouter();
	const { isLoading } = useUserQuery(
		{},
		{
			onSuccess: (data) => {
				if (
					typeof data.user !== "undefined" &&
					data.user !== null &&
					typeof user === "undefined"
				) {
					setState({
						isAuthenticated: true,
						user: data.user,
					});
				}

				if (!data.user && !user && isProtected) {
					router.push(
						"/login?" +
							QueryString.stringify({
								message: "Could not verify user, please login again.",
							}),
					);
				}
			},
			onError(error) {
				if (isProtected) {
					router.push(
						"/login?" +
							QueryString.stringify({
								message: "Could not verify user, please login again.",
							}),
					);
				}
			},
		},
	);

	return { isAuthenticated, isLoading, user };
}
