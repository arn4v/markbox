import { gql } from "@apollo/client";

export default gql`
	mutation Register($email: String!, $password: String!) {
		register(email: $email, password: $password) {
			code
			message
		}
	}
`;
