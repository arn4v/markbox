import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default interface GQLContext {
  req: NextApiRequest;
  res: NextApiResponse;
  user?: User;
}
