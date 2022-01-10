import { z } from "zod";

export type ArgumentTypes<F extends Function> = F extends (
	...args: infer A
) => any
	? A
	: never;

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export const sortBySchema = z.enum([
	"created_at_asc",
	"created_at_desc",
	"updated_at_desc",
	"updated_at_asc",
]);

export type SortBy = z.infer<typeof sortBySchema>;
