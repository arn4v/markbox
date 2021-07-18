declare module "bookmarks-parser" {
	export type BookmarkOrFolder = {
		type: "folder" | "bookmark";
		title: string;
		url?: string;
		ns_root: "menu" | "toolbar" | "unsorted" | "unsorted" | null;
		add_date: string;
		ll_modified: string;
		children: BookmarkOrFolder[];
	};

	export type Callback = (
		error: ErrorConstructor,
		result: {
			parser: "netscape" | "pocket";
			bookmarks: BookmarkOrFolder[];
		},
	) => void;

	const parse: (html: string, callback: Callback) => void;

	export default parse;
}
