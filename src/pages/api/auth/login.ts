import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

export default nextConnect<
  NextApiRequest,
  NextApiResponse
>().post(async (req, res) => {});
