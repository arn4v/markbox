import { gql } from "@apollo/client";

export default gql`
	mutation UpdateBookmark($input: UpdateBookmarkInput!) {
		updateBookmark(input: $input) {
			id
			title
			url
			description
			tags {
				id
				name
			}
			createdAt
			updatedAt
		}
	}
`;
