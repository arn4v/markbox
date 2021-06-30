import gql from "../gql-tag";

export default gql`
	mutation UpdateToken($id: ID!, $scopes: [String!]!) {
		updateToken(id: $id, scopes: $scopes) {
			id
			name
			lastUsed
			scopes
		}
	}
`;
