import { NextApiRequest } from "next";
import { prisma } from "~/lib/utils.server";
import ApiResponse from "./ApiResponse";

export default interface GQLContext {
	req: NextApiRequest;
	res: ApiResponse;
	prisma: typeof prisma;
}
