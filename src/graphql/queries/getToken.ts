import gql from "../gql-tag";

export default gql`
	query GetToken($id: ID!) {
		token(id: $id) {
			id
			name
			scopes
			lastUsed
		}
	}
`;
