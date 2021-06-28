import gql from "../gql-tag";

export default gql`
	mutation GenerateApiKey($name: String!) {
		generateApiKey(name: $name) {
			id
			name
			key
		}
	}
`;
