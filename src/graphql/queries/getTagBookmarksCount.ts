import gql from "../gql-tag";

export default gql`
	query GetTagBookmarkCount($id: ID!) {
		getTagBookmarkCount(id: $id)
	}
`;
