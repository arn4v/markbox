import gql from "../gql-tag";

export default gql`
	query GetTags {
		tags {
			id
			name
		}
	}
`;
