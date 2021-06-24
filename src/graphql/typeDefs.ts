import gql from "./gql-tag";

export default gql`
	type Bookmark {
		id: ID!
		title: String!
		url: String!
		tags: [Tag!]!
		createdAt: String!
		updatedAt: String!
	}

	type Tag {
		id: ID!
		name: String!
	}

	input TagInput {
		id: ID!
	}

	input CreateBookmarkInput {
		title: String!
		url: String!
		tags: [TagInput!]!
	}

	input UpdateBookmarkInput {
		id: ID!
		title: String
		url: String
		tags: [TagInput!]
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
	}

	type Query {
		bookmark(id: ID!): Bookmark!
		bookmarks(tag: TagInput): [Bookmark!]!
		tags: [Tag!]
		user: User
	}

	type Mutation {
		login(email: String!, password: String!): LoginMessage
		register(email: String!, password: String!): AuthenticationMessage
		createBookmark(input: CreateBookmarkInput!): Bookmark
		updateBookmark(input: UpdateBookmarkInput!): Bookmark
		deleteBookmark(id: ID!): Boolean
	}
`;
