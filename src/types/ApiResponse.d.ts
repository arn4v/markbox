import { NextApiResponse } from "next";
import { createSetCookie } from "~/lib/cookie";

export default interface ApiResponse extends NextApiResponse {
  setCookie: ReturnType<typeof createSetCookie>;
}
