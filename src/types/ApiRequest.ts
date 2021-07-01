import { NextApiRequest } from "next";
import DecodedPat from "./DecodedPat";

export default interface ApiRequest extends NextApiRequest {
	ctx: {
		decodedJwt?: DecodedPat;
		userId?: string;
	};
}
