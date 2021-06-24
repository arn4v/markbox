import { NextApiRequest } from "next";
import prisma from "~/lib/prisma";
import ApiResponse from "./ApiResponse";

export default interface GQLContext {
	req: NextApiRequest;
	res: ApiResponse;
	prisma: typeof prisma;
}
