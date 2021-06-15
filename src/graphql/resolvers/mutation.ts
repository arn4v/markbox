import { comparePassword, hashPassword } from "~/lib/password";
import GQLContext from "~/types/GQLContext";
import { MutationResolvers } from "../types.generated";
import prisma from "~/lib/prisma";
import { jwtSign } from "~/lib/jwt";

export default {
  async login(_, { email, password }, ctx) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      const isPasswordValid = await comparePassword(password, user.password);
      if (isPasswordValid) {
        const jwt = await jwtSign({ sub: user.id });
        return {
          code: "successful",
          message: "Successfully logged in.",
          accessToken: jwt,
        };
      } else {
        return {
          code: "invalid_password",
          message: "Passwords don't match.",
        };
      }
    } else {
      return {
        code: "invalid_user",
        message: "User doesn't exist",
      };
    }
  },
  async register(_, { email, password }, ctx) {
    console.log(email, password);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      const hashedPassword = await hashPassword(password);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      return {
        code: "successful",
        message: "Successfully registered. Please log in.",
      };
    } else {
      return {
        code: "conflict",
        message: "User already exists.",
      };
    }
  },
  async createBookmark(_, { input }, ctx) {
    const { tags, title, url } = input;
    const newBookmark = await prisma.bookmark.create({
      data: {
        title: title,
        url: url,
        tags: {
          create: tags.map((item) => ({ title: item })),
        },
      },
    });
    const newTags = await prisma.tag.findMany({
      where: {
        bookmarkId: newBookmark.id,
      },
    });
    return {
      id: newBookmark.id,
      title: newBookmark.title,
      url: newBookmark.url,
      tags: newTags.map((item) => item.title),
    };
  },
  async updateBookmark(_, { id, input }, ctx) {
    const { title, url } = input;
    const _updated = await prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        title: title,
        url: url,
      },
    });
    const _tags = await prisma.tag.findMany({
      where: {
        bookmarkId: _updated.id,
      },
    });
    return {
      id: _updated.id,
      title: _updated.title,
      url: _updated.url,
      tags: _tags.map((item) => item.title),
    };
  },
} as MutationResolvers<GQLContext>;
