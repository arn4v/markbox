import { z } from "zod";

export const sortBySchema = z.enum(
	"created_at_asc",
	"created_at_desc",
	"updated_at_desc",
	"updated_at_asc",
);

export type SortBy = z.infer<typeof sortBySchema>;
