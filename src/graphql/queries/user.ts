import { gql } from "@apollo/client";

export default gql`
	query User {
		user {
			id
			email
			emailVerified
			createdAt
		}
	}
`;
