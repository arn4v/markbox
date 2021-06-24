interface Component<P = {}> {
	(props: P): JSX.Element;
	displayName?: string;
}
