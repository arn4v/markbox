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

	type AccessToken {
		id: ID!
		name: String!
		lastUsed: String!
		scopes: [String!]!
	}

	type GeneratedAccessToken {
		id: ID!
		name: String!
		token: String!
		lastUsed: String!
		scopes: [String!]!
	}

	input FilterBookmarksTagInput {
		name: String!
	}

	input CreateOrUpdateBookmarkTagInput {
		id: String
		name: String
	}

	input CreateBookmarkInput {
		title: String!
		url: String!
		tags: [CreateOrUpdateBookmarkTagInput!]!
	}

	input UpdateBookmarkInput {
		id: ID!
		title: String
		url: String
		tags: [CreateOrUpdateBookmarkTagInput!]
		tagsDisconnect: [CreateOrUpdateBookmarkTagInput!]
	}

	input RenameTagInput {
		id: ID!
		name: String!
	}

	type Query {
		bookmark(id: ID!): Bookmark!
		bookmarks(tag: FilterBookmarksTagInput): [Bookmark!]!
		tag(id: ID!): Tag!
		tagBookmarksCount(id: ID!): Int!
		tags: [Tag!]
		user: User
		tokens: [AccessToken!]!
		token(id: ID!): AccessToken!
	}

	type Mutation {
		createBookmark(input: CreateBookmarkInput!): Bookmark!
		updateBookmark(input: UpdateBookmarkInput!): Bookmark!
		renameTag(input: RenameTagInput): Tag!
		deleteTag(id: ID!): Boolean!
		deleteBookmark(id: ID!): Boolean!
		generateToken(name: String!, scopes: [String!]!): GeneratedAccessToken!
		updateToken(id: ID!, scopes: [String!]!): AccessToken!
		deleteToken(id: ID!): Boolean!
	}
`;
