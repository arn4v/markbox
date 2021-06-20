import { User } from "@prisma/client";
import { NextApiRequest } from "next";
import ApiResponse from "./ApiResponse";

export default interface GQLContext {
  req: NextApiRequest;
  res: ApiResponse;
  user?: User;
}
