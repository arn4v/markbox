import { useRouter } from "next/router";
import generate from "project-name-generator";
import * as React from "react";
import { HiClipboardCheck, HiOutlineClipboard } from "react-icons/hi";
import { useGenerateTokenMutation } from "~/graphql/types.generated";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function NewTokenPage() {
	const router = useRouter();
	const [token, setToken] = React.useState<string>(undefined);
	const [isCopied, setCopied] = React.useState<boolean>(false);
	const { mutate } = useGenerateTokenMutation({
		onSuccess(data) {
			setToken(data.generateToken.token);
		},
	});
	const tokenInputRef = React.useRef<HTMLTextAreaElement>(null);

	const [state, setState] = React.useState({
		name: generate().dashed,
		scopes: ["all"],
	});

	return (
		<SettingsPageWrapper>
			<div className="flex flex-col flex-grow gap-8 pl-12 lg:w-3/4">
				<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
					<span className="text-xl font-bold">Generate new token</span>
				</div>
				{!token ? (
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
				) : (
					<div className="flex items-center w-full gap-4 p-4 rounded-lg bg-blueGray-700">
						<textarea
							ref={tokenInputRef}
							onClick={(e) => tokenInputRef.current.select()}
							className="w-full px-4 py-1 rounded dark:bg-blueGray-50 dark:text-black"
							value={token}
							rows={4}
							disabled
						/>
						<button
							onClick={() => {
								navigator.clipboard.writeText(token);
								setCopied(true);
								setTimeout(() => setCopied(false), 3000);
							}}
							className="p-2 rounded focus:outline-none bg-blueGray-600 bg-blend-multiply"
						>
							{isCopied ? (
								<HiClipboardCheck className="w-5 h-5" />
							) : (
								<HiOutlineClipboard className="w-5 h-5" />
							)}
						</button>
					</div>
				)}
			</div>
		</SettingsPageWrapper>
	);
}
