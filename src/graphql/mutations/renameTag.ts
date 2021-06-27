import gql from "../gql-tag";

export default gql`
	mutation RenameTag($input: RenameTagInput) {
		renameTag(input: $input) {
			id
		}
	}
`;
