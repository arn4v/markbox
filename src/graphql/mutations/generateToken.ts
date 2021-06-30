import gql from "../gql-tag";

export default gql`
	mutation GenerateToken($name: String!, $scopes: [String!]!) {
		generateToken(name: $name, scopes: $scopes) {
			id
			name
			token
			lastUsed
			scopes
		}
	}
`;
