import gql from "../gql-tag";

export default gql`
	query GetBookmark($id: ID!) {
		bookmark(id: $id) {
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
