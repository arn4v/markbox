import { gql } from "apollo-server-micro";

export default gql`
  type Bookmark {
    id: ID!
    title: String!
    url: String!
    tags: [String!]!
  }

  input AddUpdateBookmarkInput {
    title: String!
    url: String!
    tags: [String!]!
  }

  type AuthenticationMessage {
    code: String!
    message: String!
  }

  type Query {
    bookmark(id: ID!): Bookmark!
    bookmarks: [Bookmark!]!
  }

  type Mutation {
    login(email: String!, password: String!): AuthenticationMessage
    register(email: String!, password: String!): AuthenticationMessage
    addBookmark(input: AddUpdateBookmarkInput): Bookmark
    updateBookmark(id: ID!, input: AddUpdateBookmarkInput): Bookmark
  }
`;
