import { gql } from "@apollo/client";

export default gql`
	mutation CreateBookmark($input: CreateBookmarkInput!) {
		createBookmark(input: $input) {
			id
			title
			url
			tags
			createdAt
			updatedAt
		}
	}
`;
