import * as React from "react";
import { Popup } from "./Popup";
import { useOnClickOutside } from "~/hooks/onclick-outside";
import { useCreateBookmarkMutation } from "~/graphql/types.generated";

const AddBookmark = () => {
	const [state, setState] = React.useState({
		title: "",
		url: "",
		tags: {},
		folder: "",
	});
	const [add, setAdd] = React.useState(false);
	const [createBookmark] = useCreateBookmarkMutation();
	const ref = React.useRef(null);

	const cancel = () => {
		setState(() => initialState);
		setAdd(false);
	};

	const onSubmit = (e) => {
		e.preventDefault();
		createBookmark({
			variables: state,
		});
	};

	const showAdd = () => {
		setAdd(true);
	};

	const onChange = (e) => {
		setState((s) => ({ ...s, [e.target.name]: e.target.value }));
	};

	useOnClickOutside(ref, cancel);

	return (
		<div ref={ref} className="relative h-auto pb-4 border-b border-gray-500">
			<button
				onClick={showAdd}
				className="px-2 py-1.5 w-full dark:text-white dark:bg-blueGray-700 dark:hover:bg-blueGray-600 rounded-lg transition duration-150 ease-in-out focus:outline-none">
				Create bookmark
			</button>
			<Popup className="" show={add}>
				<form className="flex flex-col gap-3" onSubmit={onSubmit}>
					<input
						name="title"
						type="text"
						placeholder="Title"
						value={state.title}
						onChange={onChange}
						className="rounded-lg dark:text-black px-2 py-1.5 focus:ring focus:ring-emerald-400 transition duration-150 ease-in-out border-none"
					/>
					<input
						name="url"
						type="url"
						placeholder="URL"
						value={state.url}
						onChange={onChange}
						className="rounded-lg dark:text-black px-2 py-1.5 focus:ring focus:ring-emerald-400 transition duration-150 ease-in-out border-none"
						required
					/>
					<div className="flex justify-between gap-12">
						<button
							onClick={cancel}
							className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
							Cancel
						</button>
						<button
							type="submit"
							className="w-full items-center justify-center hover:bg-blueGray-500 flex px-1.5 py-1 transition duration-150 ease-in-out bg-blueGray-600 rounded-lg focus:outline-none">
							Add
						</button>
					</div>
				</form>
			</Popup>
		</div>
	);
};

export default AddBookmark;
