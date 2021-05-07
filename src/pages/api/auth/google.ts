import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { API_BASE_URL } from "~/constants";
import { googleOauth2 } from "~/lib/oauth";

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    const state = crypto.randomBytes(10).toString("hex");
    const authorizeUri = googleOauth2.authorizeURL({
      redirect_uri: API_BASE_URL + "/auth/google/callback",
      scope: "openid email profile",
      state,
    });
    res.redirect(authorizeUri);
  }
);
