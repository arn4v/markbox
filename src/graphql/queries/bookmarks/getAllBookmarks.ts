import { gql } from "@apollo/client";

export default gql`
  query GetAllBookmarks {
    bookmarks {
      id
      title
      url
      tags
    }
  }
`;
