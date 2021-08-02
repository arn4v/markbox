import qs from "querystring";
import { createHandler } from "~/lib/utils.server";

export default createHandler().get(async (req, res) => {
	if (
		typeof req.body?.title === "string" &&
		typeof req.body?.url === "string" &&
		typeof req.body?.description === "string"
	) {
		res.redirect(302, "/create?" + qs.stringify(req.body));
	} else {
		res.redirect(302, "/create");
	}
	res.end();
});
