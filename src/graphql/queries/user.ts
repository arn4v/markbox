import gql from "../gql-tag";

export default gql`
	query User {
		user {
			id
			name
			email
			emailVerified
			createdAt
		}
	}
`;
