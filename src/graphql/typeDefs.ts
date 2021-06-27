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

	input FilterBookmarksTagInput {
		id: ID!
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

	input RenameTagInput {
		id: ID!
		name: String!
	}

	type Query {
		bookmark(id: ID!): Bookmark!
		bookmarks(tag: FilterBookmarksTagInput): [Bookmark!]!
		getTagBookmarkCount(id: ID!): Int!
		tags: [Tag!]
		user: User
	}

	type Mutation {
		createBookmark(input: CreateBookmarkInput!): Bookmark
		updateBookmark(input: UpdateBookmarkInput!): Bookmark
		renameTag(input: RenameTagInput): Tag
		deleteTag(id: ID!): Boolean
		deleteBookmark(id: ID!): Boolean
	}
`;
