import { gql } from "@apollo/client";

export default gql`
	query GetAllBookmarks($tag: FilterBookmarksTagInput, $sort: String!, $cursor: String) {
		bookmarks(tag: $tag, sort: $sort, cursor: $cursor) {
			cursor
			next_cursor
			data {
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
	}
`;
