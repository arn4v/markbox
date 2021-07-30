import gql from "./gql-tag";

export default gql`
	type Bookmark {
		id: ID!
		title: String!
		description: String!
		url: String!
		tags: [Tag!]!
		isFavourite: Boolean!
		createdAt: String!
		updatedAt: String!
	}

	type Tag {
		id: ID!
		name: String!
		isPinned: Boolean!
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
		name: String!
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

	type ChangePasswordMessage {
		code: String!
	}

	input UpdateProfileInput {
		id: ID!
		name: String!
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
		description: String!
		tags: [CreateOrUpdateBookmarkTagInput!]!
	}

	input UpdateBookmarkInput {
		id: ID!
		title: String
		url: String
		description: String
		tags: [CreateOrUpdateBookmarkTagInput!]
		tagsDisconnect: [CreateOrUpdateBookmarkTagInput!]!
	}

	input RenameTagInput {
		id: ID!
		name: String!
	}

	type GetBookmarksData {
		cursor: String
		next_cursor: String!
		data: [Bookmark!]!
	}

	type Query {
		bookmark(id: ID!): Bookmark!
		bookmarks(
			tag: FilterBookmarksTagInput
			sort: String!
			cursor: String
		): GetBookmarksData
		tag(id: ID!): Tag!
		bookmarksCount(tagName: String): Int!
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
		updateProfile(input: UpdateProfileInput!): Boolean!
		favouriteBookmark(id: ID!, isFavourite: Boolean!): Boolean!
		pinTag(id: ID!, isPinned: Boolean!): Boolean!
	}
`;
