import fs from "fs";
import path from "path";

const DOCS_PATH = path.resolve(process.cwd(), "./src/docs");

export const getDocsSlugs = () => {
	return getMdxFiles(DOCS_PATH, "");
};

export const getMdxFiles = (
	folderPath: string,
	folderSlugPath: string,
): string[] => {
	const mdxFiles = [];
	const folders = [];

	fs.readdirSync(folderPath).forEach((item) => {
		if (/\.mdx/.exec(item)) {
			mdxFiles.push(
				`${folderSlugPath.length > 0 ? folderSlugPath + "/" : ""}${item}`,
			);
		} else {
			folders.push(item);
		}
	});

	if (folders.length > 0) {
		folders.forEach((folder) => {
			mdxFiles.push(
				...getMdxFiles(
					path.resolve(folderPath, folder),
					`${folderSlugPath.length > 0 ? folderSlugPath + "/" : ""}${folder}`,
				),
			);
		});
	}

	return mdxFiles;
};

export const getSourceFromSlugArray = (slug: string[]) => {
	return fs.readFileSync(path.resolve(DOCS_PATH, slug.join("/") + ".mdx"), {
		encoding: "utf-8",
	});
};
