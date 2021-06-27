import gql from "../gql-tag";

export default gql`
	query GetAllTags {
		tags {
			id
			name
		}
	}
`;
