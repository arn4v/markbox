import gql from "../gql-tag";

export default gql`
	mutation DeleteTag($id: ID!) {
		deleteTag(id: $id)
	}
`;
