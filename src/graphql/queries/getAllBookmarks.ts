import { gql } from "@apollo/client";

export default gql`
	query GetAllBookmarks($tagName: String) {
		bookmarks(tag: $tagName) {
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
