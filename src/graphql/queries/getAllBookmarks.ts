import { gql } from "@apollo/client";

export default gql`
	query GetAllBookmarks($tag: FilterBookmarksTagInput, $sort: String!) {
		bookmarks(tag: $tag, sort: $sort) {
			id
			title
			url
			tags {
				id
				name
			}
			createdAt
			updatedAt
		}
	}
`;
