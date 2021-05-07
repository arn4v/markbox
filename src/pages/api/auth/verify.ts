import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { jwtVerify } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    const token = req.cookies.token;
    try {
      const payload = await jwtVerify(token);
      const user = await prisma.user.findFirst({
        where: {
          id: payload.id,
        },
      });
      console.log(payload, user);
      if (user) {
        res.status(200).end();
      } else {
        res.status(403).end();
      }
    } catch (err) {
      console.log(err);
      res.status(403).end();
    }
  },
);
