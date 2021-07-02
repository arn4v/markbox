import fs from "fs";
import matter from "gray-matter";
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
		if (/\.mdx?/.test(item)) {
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
	let filePath = path.resolve(DOCS_PATH, slug.join("/") + ".md");
	if (!fs.existsSync(filePath)) {
		filePath += "x";
	}

	return fs.readFileSync(filePath, {
		encoding: "utf-8",
	});
};

export const getSourceFromPath = (relative: string) => {
	return fs.readFileSync(path.resolve(DOCS_PATH, relative), {
		encoding: "utf-8",
	});
};

export const getSidebarData = () => {
	const allFiles = getDocsSlugs();
	return allFiles.reduce((acc, cur) => {
		const source = getSourceFromPath(cur);
		const metadata = matter(source).data;
		if (cur.includes("/")) {
			let [parent, child] = cur.split("/");
			child = child.replace(/\.mdx/g, "");
			const title = parent[0].toUpperCase() + parent.slice(1);
			if (acc[title]) {
				acc[title].push({
					slug: cur.replace(/\.mdx/, ""),
					title: child[0].toUpperCase() + child.slice(1),
				});
			} else {
				acc[title] = [
					{
						slug: cur.replace(/\.mdx/, ""),
						title: child[0].toUpperCase() + child.slice(1),
					},
				];
			}
		} else {
			acc[metadata.title] = {
				slug: cur.replace(/\.mdx/, ""),
				title: metadata.title,
			};
		}
		return acc;
	}, {});
};
