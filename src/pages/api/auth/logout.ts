import QueryString from "qs";
import { routeHandler, withCookies } from "~/lib/utils.server";
import ApiResponse from "~/types/ApiResponse";

export default withCookies(
	routeHandler().get(async (req, res: ApiResponse) => {
		res
			.removeCookie("access_token")
			.redirect(
				"/login?" +
					QueryString.stringify({ message: "You have been logged out." }),
			);
	}),
);
