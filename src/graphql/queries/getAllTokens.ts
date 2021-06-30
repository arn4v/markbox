import gql from "../gql-tag";

export default gql`
	query GetAllTokens {
		tokens {
			id
			name
			scopes
			lastUsed
		}
	}
`;
