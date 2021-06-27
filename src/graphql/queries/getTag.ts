import gql from "../gql-tag";

export default gql`
	query GetTag($id: ID!) {
		tag(id: $id) {
			id
			name
		}
	}
`;
