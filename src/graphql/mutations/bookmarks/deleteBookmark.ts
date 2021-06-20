import { gql } from "@apollo/client";

export default gql`
  mutation DeleteBookmark($id: ID!) {
    deleteBookmark(id: $id)
  }
`;
