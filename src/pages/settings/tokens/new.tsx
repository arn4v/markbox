import { useRouter } from "next/router";
import generate from "project-name-generator";
import * as React from "react";
import { useGenerateTokenMutation } from "~/graphql/types.generated";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function NewTokenPage() {
	const router = useRouter();
	const { mutate } = useGenerateTokenMutation({
		onSuccess() {
			router.push("/settings/tokens");
		},
	});
	const [state, setState] = React.useState({
		name: generate().dashed,
	});

	return (
		<SettingsPageWrapper>
			<h1>Create token</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					mutate(state);
				}}
			>
				<div className="w-full">
					<label htmlFor="title" className="block">
						Name
					</label>
					<input
						id="title"
						type="text"
						className="block w-full h-10 mt-2 text-black rounded-lg focus:outline-none focus:ring ring-black caret-black"
						value={state.name}
						onChange={(e) =>
							setState((prev) => ({ ...prev, name: e.target.value }))
						}
						required
					/>
				</div>
				<button
					type="submit"
					className="px-4 py-2 mt-4 ml-auto transition rounded-md bg-blueGray-600 hover:bg-blueGray-500 focus:ring ring-black focus:outline-none"
				>
					Submit
				</button>
			</form>
		</SettingsPageWrapper>
	);
}
