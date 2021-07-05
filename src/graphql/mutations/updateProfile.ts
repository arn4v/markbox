import gql from "../gql-tag";

export default gql`
	mutation UpdateProfile($input: UpdateProfileInput!) {
		updateProfile(input: $input)
	}
`;
