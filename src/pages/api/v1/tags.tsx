import { patAuthMiddleware, routeHandler, withCookies } from "~/lib/utils.server";

const handler = routeHandler().use(patAuthMiddleware).patch();

export default withCookies(handler)
