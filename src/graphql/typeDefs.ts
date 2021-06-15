import { gql } from "apollo-server-micro";

export default gql`
  type Bookmark {
    id: ID!
    title: String!
    url: String!
    tags: [String!]!
  }

  input CreateBookmarkInput {
    title: String!
    url: String!
    tags: [String!]!
  }

  input UpdateBookmarkInput {
    title: String
    url: String
    tags: [String!]
  }

  type AuthenticationMessage {
    code: String!
    message: String!
  }

  type LoginMessage {
    code: String!
    message: String!
    accessToken: String
  }

  type User {
    id: ID!
    email: String!
    emailVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    bookmark(id: ID!): Bookmark!
    bookmarks: [Bookmark!]!
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): LoginMessage
    register(email: String!, password: String!): AuthenticationMessage
    createBookmark(input: CreateBookmarkInput!): Bookmark
    updateBookmark(id: ID!, input: UpdateBookmarkInput!): Bookmark
  }
`;
