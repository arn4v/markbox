import { hashPassword } from "~/lib/password";
import GQLContext from "~/types/GQLContext";
import { MutationResolvers } from "../types.generated";
import prisma from "~/lib/prisma";

const MutationResolvers: MutationResolvers<GQLContext> = {
  async login(_, args, ctx) {
    return {
      code: "",
      message: "",
    };
  },
  async register(_, { email, password }, ctx) {
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
        message: "Successfully registered user.",
      };
    } else {
      return {
        code: "conflict_user_exists",
        message: "User already exists.",
      };
    }
  },
  async addBookmark(_, { input }, ctx) {
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
};

export default MutationResolvers;
