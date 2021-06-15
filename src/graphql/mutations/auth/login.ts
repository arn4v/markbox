import { gql } from "@apollo/client";

export default gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      code
      message
      accessToken
    }
  }
`;
