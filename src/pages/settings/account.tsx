import { NextSeo } from "next-seo";
import * as React from "react";
import toast from "react-hot-toast";
import { Input }  from "~/components/Input";
import { trpc } from "~/lib/trpc";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function AccountSettingsPage() {
	const [state, setState] = React.useState({ id: "", name: "" });
	trpc.useQuery(["users.me"], {
		onSuccess(data) {
			if (data && state.id === "") {
				setState({
					id: data.id,
					name: data.name,
				});
			}
		},
	});
	const { mutate } = trpc.useMutation("users.updateProfile", {
		onSuccess() {
			toast.success("Successfully updated profile.", {
				position: "top-center",
				duration: 3000,
			});
		},
	});

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		mutate(state);
	};

	return (
		<SettingsPageWrapper>
			<NextSeo title="Profile Settings" noindex />
			<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12">
				<div className="flex items-center justify-between w-full pb-4 border-b border-gray-500">
					<span className="text-xl font-bold">Profile settings</span>
				</div>
				<div className="flex flex-col items-start justify-start rounded-lg">
					<h3 className="mb-6 text-lg font-semibold">Update name</h3>
					<form
						onSubmit={onSubmit}
						className="flex flex-col w-full gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:border-none dark:bg-gray-900"
					>
						<div className="w-full">
							<label htmlFor="name" className="block">
								Name
							</label>
							<Input
								id="name"
								type="text"
								className="block w-full h-10 mt-4"
								value={state.name}
								onChange={(e) =>
									setState((prev) => ({ ...prev, name: e.target.value }))
								}
								required
							/>
						</div>
						<button
							type="submit"
							className="px-4 py-2 mt-4 ml-auto transition bg-gray-100 border border-gray-300 rounded-md dark:border-none dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
		</SettingsPageWrapper>
	);
}
