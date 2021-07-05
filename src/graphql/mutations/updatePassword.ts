import gql from "../gql-tag";

export default gql`
	mutation UpdatePassword($input: UpdatePasswordInput!) {
		updatePassword(input: $input) {
			code
		}
	}
`;
