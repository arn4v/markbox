import { gql } from "@apollo/client";

export default gql`
	mutation UpdateBookmark($id: ID!, $input: UpdateBookmarkInput!) {
		updateBookmark(id: $id, input: $input) {
			id
			title
			url
			tags
			createdAt
			updatedAt
		}
	}
`;
