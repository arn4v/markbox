import * as React from "react";
import clsx from "clsx";
import { Badge } from "../../../components/Badge";
import { randomColor } from "~/lib/utils";
import { v4 as uuid } from "uuid";
import { useCreateBookmarkMutation } from "~/graphql/types.generated";

/**
 * @typedef {Object} Props
 * @property {string} className
 */

/**
 * @type {React.FC<Props>}
 * @exports
 */
const AddForm = ({ className }) => {
	const [state, setState] = React.useState({
		title: "",
		url: "",
		tags: {},
		newTag: "",
		showError: false,
		newTagError: undefined,
	});
	const [createBookmark] = useCreateBookmarkMutation();

	const onSubmit = (e) => {
		e.preventDefault();
		const bookmark = {
			title: state.title,
			url: state.url,
			tags: state.tags,
		};
		createBookmark({ variables: { input: bookmark } });
	};

	const deleteTag = (id) => () =>
		setState((s) => {
			delete s.tags[id];
			return { ...s };
		});

	const addTag = () => {
		if (!state.newTagError) {
			const id = uuid();
			const title = state.newTag;
			const color = randomColor(state.tags);
			const created = new Date();
			const tag = { id, title, color, created };
			setState((s) => ({ ...s, tags: { ...s.tags, [id]: tag }, newTag: "" }));
		} else {
			setState((s) => ({ ...s, showError: true }));
		}
	};
	const onChange = (e) =>
		setState((s) => ({ ...s, [e.target.id]: e.target.value }));

	React.useEffect(() => {
		setState((s) => {
			let newTagError = false;
			if (state.newTag.length === 0) newTagError = "";
			if (
				Object.values(state.tags)
					.map((i) => i.title)
					.includes(state.newTag)
			)
				newTagError = "A tag by this name already exists";
			return { ...s, newTagError };
		});
	}, [state.newTag, state.tags]);

	return (
		<form onSubmit={onSubmit} className={clsx(["form-container", className])}>
			<div className="">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					value={state.title}
					onChange={onChange}
					type="text"
					required
					className="input-sheet"
				/>
			</div>
			<div className="">
				<label htmlFor="url" className="form-label">
					URL
				</label>
				<input
					id="url"
					onChange={onChange}
					value={state.url}
					type="url"
					required
					className="input-sheet"
				/>
			</div>
			<div>
				<label className="form-label">Tags</label>
				<div className="flex flex-wrap gap-2 w-full my-2">
					{Object.values(state.tags).map((item) => {
						return (
							<Badge key={item.id} title={item.title} className={item.color}>
								<button
									className="rounded-full py-0.5 focus:outline-none flex"
									type="button"
									id={item.id}
									onClick={deleteTag(item.id)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className="w-3.5 h-3.5 text-white">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</Badge>
						);
					})}
				</div>
				{Object.keys(state.tags).length <= 10 && (
					<div
						className={clsx([
							"flex items-center justify-between overflow-hidden bg-white rounded-md focus:ring focus:ring-emerald-400",
							{
								"ring ring-red-500":
									state.newTag.length > 0 && state.newTagError !== undefined,
								"ring ring-green-500":
									state.newTag.length > 0 && !state.newTagError,
							},
						])}>
						<input
							id="newTag"
							type="text"
							className="mr-4 border-0 focus:ring-0"
							onChange={onChange}
							maxLength={15}
							value={state.newTag}
						/>
						<button
							type="button"
							className={clsx([
								"h-full px-3 text-xs font-semibold uppercase focus:outline-none whitespace-nowrap",
								{
									"text-gray-800": state.newTag.length > 0,
									"text-gray-500": state.newTag.length === 0,
								},
							])}
							onClick={addTag}
							disabled={state.newTagError}>
							Add tag
						</button>
					</div>
				)}
				{state.showError && (
					<div className="flex bg-red-500 px-2 py-0.5 text-white text-sm font-medium rounded-md items-center justify-start mt-2">
						{state.newTagError}
					</div>
				)}
			</div>
			<div className="flex items-center gap-4">
				<label
					htmlFor="toRead"
					className="text-sm font-medium text-white uppercase">
					To read?
				</label>
				<input
					id="toRead"
					type="checkbox"
					v-model="toRead"
					className="w-4 h-4 border-0 rounded text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
				/>
			</div>
			<button
				type="submit"
				className="px-4 py-2.5 mx-auto mt-2 text-sm font-medium text-white uppercase rounded-lg bg-blueGray-600 focus:outline-none select-none">
				Submit
			</button>
		</form>
	);
};

export default AddForm;
