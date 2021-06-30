import { routeHandler, withCookies } from "~/lib/utils.server";
import ApiResponse from "~/types/ApiResponse";
import Joi from "joi";

const handler = routeHandler<ApiResponse>()
	.post(async (req, res) => {})
	.get(async (req, res) => {});

export default withCookies(handler);
