import parse from "bookmarks-parser";

export const parsePromise = (html: string) =>
	new Promise((resolve, reject) => {
		parse(html, (err, { bookmarks }) => {
			err ? reject(err) : resolve(bookmarks);
		});
	});