import { gql } from "@apollo/client";

export default gql`
  mutation AddBookmark($id: ID!, $input: AddUpdateBookmarkInput) {
    updateBookmark(id: $id, input: $input) {
      id
      title
      url
      tags
    }
  }
`;
