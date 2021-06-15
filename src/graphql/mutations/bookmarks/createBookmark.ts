import { gql } from "@apollo/client";

export default gql`
  mutation CreateBookmarkInput($id: ID!, $input: CreateBookmarkInput!) {
    createBookmark(input: $input) {
      id
      title
      url
      tags
    }
  }
`;
