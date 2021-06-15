import { gql } from "@apollo/client";

export default gql`
  query GetBookmark($id: ID!) {
    bookmark(id: $id) {
      id
      title
      url
      tags
    }
  }
`;
