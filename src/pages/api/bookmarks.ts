import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      await NextCors(req, res, {
        methods: ["GET"],
        origin: "*",
      });
      break;
    }
    case "POST": {
      break;
    }
    case "PUT": {
      break;
    }
    case "DELETE": {
      break;
    }
    default: {
      break;
    }
  }
};
