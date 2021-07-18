import { User } from "@prisma/client";
import { NextApiRequest } from "next";
import DecodedPat from "./DecodedPat";

export default interface ApiRequestGQL extends NextApiRequest {
	ctx: {
		decodedJwt?: DecodedPat;
		userId?: string;
	};
}

export interface ApiRequest extends NextApiRequest {
	ctx: {
		user: User;
	};
}
