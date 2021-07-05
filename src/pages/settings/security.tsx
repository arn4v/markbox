import { NextSeo } from "next-seo";
import * as React from "react";
import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "~/graphql/types.generated";
import { useAuth } from "~/hooks/use-auth";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function AccountSecurityPage() {
	const initialState = {
		currentPassword: "",
		newPassword: "",
	};
	const [state, setState] = React.useState(initialState);
	const { user } = useAuth();
	const { mutate } = useUpdatePasswordMutation({
		onSuccess(data) {
			switch (data.updatePassword.code) {
				case "current_password_invalid": {
					toast.error("Wrong current password, try again.", {
						duration: 3000,
						position: "top-center",
					});
					break;
				}
				default: {
					toast.success("Successfully updated password.", {
						duration: 3000,
						position: "top-center",
					});
					setState(initialState);
					break;
				}
			}
		},
	});

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		mutate({
			input: {
				...state,
				id: user.id,
			},
		});
	};

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};

	return (
		<SettingsPageWrapper>
			<NextSeo title="Security Settings" noindex />
			<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12 dark:text-white">
				<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
					<span className="text-xl font-bold">Security settings</span>
				</div>
				<div className="flex flex-col items-start justify-start rounded-lg">
					<h3 className="mb-6 text-lg font-semibold">Update password</h3>
					<form
						onSubmit={onSubmit}
						className="flex flex-col w-full gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:border-none dark:bg-gray-900"
					>
						<div className="w-full">
							<label htmlFor="currentPassword" className="block">
								Current password
							</label>
							<input
								id="currentPassword"
								type="password"
								autoComplete="current-password"
								className="block w-full h-10 mt-4 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 caret-black"
								value={state.currentPassword}
								onChange={onChange}
								required
							/>
						</div>
						<div className="w-full">
							<label htmlFor="newPassword" className="block">
								New password
							</label>
							<input
								id="newPassword"
								type="password"
								autoComplete="new-password"
								className="block w-full h-10 mt-4 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 caret-black"
								value={state.newPassword}
								onChange={onChange}
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
