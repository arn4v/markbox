import gql from "../gql-tag";

export default gql`
	query GetBookmarksCount($tagName: String) {
		bookmarksCount(tagName: $tagName)
	}
`;
