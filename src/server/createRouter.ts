import * as trpc from "@trpc/server";
import { TrpcContext } from "./createContext";

export const createRouter = () => trpc.router<TrpcContext>();
