import gql from "../gql-tag";

export default gql`
	mutation FavouriteBookmark($id: ID!, $isFavourite: Boolean!) {
		favouriteBookmark(id: $id, isFavourite: $isFavourite)
	}
`;
