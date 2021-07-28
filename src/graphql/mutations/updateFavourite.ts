import gql from "../gql-tag";

export default gql`
	mutation UpdateFavourite($id: ID!, $isFavourite: Boolean!) {
		updateFavourite(id: $id, isFavourite: $isFavourite)
	}
`;
