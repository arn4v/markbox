declare module "bookmarks-parser" {
	type BookmarkOrFolder = {
		type: "folder" | "bookmark";
		title: string;
		url?: string;
		ns_root: "menu" | "toolbar" | "unsorted" | "unsorted" | null;
		children: BookmarkOrFolder[];
	};

	type Callback = (
		error: ErrorConstructor,
		result: {
			parser: "netscape" | "pocket";
			bookmarks: BookmarkOrFolder[];
		},
	) => void;

	const parse: (html: string, callback: Callback) => void;

	export default parse;
}
