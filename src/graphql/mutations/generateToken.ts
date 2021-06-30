import gql from "../gql-tag";

export default gql`
	mutation GenerateToken($name: String!) {
		generateToken(name: $name) {
			id
			name
			lastUsed
		}
	}
`;
