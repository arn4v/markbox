import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { CALLBACK_URI, googleOauth2 } from "~/lib/oauth";
import { serialize } from "cookie";
import prisma from "~/lib/prisma";
import { User } from "@prisma/client";
import { jwtSign } from "~/lib/auth";
import { isProd } from "~/constants";
import nextConnect from "next-connect";

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    const code = req.query.code as string;
    const result = await googleOauth2.getToken({
      code,
      redirect_uri: CALLBACK_URI,
      scope: "openid email profile",
    });
    let claims = {};
    const profile = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${result.token.access_token}`,
    ).then((res) => res.json());
    let user: User;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: profile.email,
        },
      });
      const { id, name, type } = user;
      claims = { sb: id, name, type };
    } catch (err) {
      if (!user) {
        const { id, name, type, email } = await prisma.user.create({
          data: {
            name: profile.name,
            email: profile.email,
            type: "google",
            email_verified: profile.email_verified,
          },
        });
        claims = { sb: id, name, type, email };
      } else {
        const { id, type } = user;
        claims = { sub: id, type };
      }
    }
    const token = await jwtSign(claims);
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        domain: isProd ? "bookmarky.io" : "localhost",
        path: "/",
        sameSite: "strict",
        secure: true,
        httpOnly: true,
      }),
    );
    res.redirect("/auth/success");
  },
);
