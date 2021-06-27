import gql from "../gql-tag";

export default gql`
	query GetTagBookmarksCount($id: ID!) {
		tagBookmarksCount(id: $id)
	}
`;
