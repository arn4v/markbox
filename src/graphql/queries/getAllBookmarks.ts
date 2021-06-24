import { gql } from "@apollo/client";

export default gql`
	query GetAllBookmarks($tag: TagInput) {
		bookmarks(tag: $tag) {
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
