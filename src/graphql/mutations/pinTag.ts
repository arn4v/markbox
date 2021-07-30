import gql from "../gql-tag";

export default gql`
	mutation PinTag($id: ID!, $isPinned: Boolean!) {
		pinTag(id: $id, isPinned: $isPinned)
	}
`;
