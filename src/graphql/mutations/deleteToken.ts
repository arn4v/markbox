import gql from "../gql-tag";

export default gql`
	mutation DeleteToken($id: ID!) {
		deleteToken(id: $id)
	}
`;
