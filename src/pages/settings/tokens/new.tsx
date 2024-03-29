import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import generate from "project-name-generator";
import * as React from "react";
import {
	HiArrowLeft,
	HiClipboardCheck,
	HiOutlineClipboard,
} from "react-icons/hi";
import { Input }  from "~/components/Input";
import { trpc } from "~/lib/trpc";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function NewTokenPage() {
	const router = useRouter();
	const [token, setToken] = React.useState<string | undefined>(undefined);
	const [isCopied, setCopied] = React.useState<boolean>(false);
	const { mutate } = trpc.useMutation("tokens.generate", {
		onSuccess(data) {
			setToken(data.token);
		},
	});
	const tokenInputRef = React.useRef<HTMLTextAreaElement>(null);

	const [state, setState] = React.useState({
		name: generate().dashed,
		scopes: ["all"],
	});

	return (
		<SettingsPageWrapper>
			<NextSeo title="Generate Access Token" noindex />
			<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12">
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
							<Input
								id="title"
								type="text"
								className="block w-full h-10 mt-2"
								value={state.name}
								onChange={(e) =>
									setState((prev) => ({ ...prev, name: e.target.value }))
								}
								required
							/>
						</div>
						<button
							type="submit"
							className="px-4 py-2 mt-4 transition bg-gray-100 border border-gray-300 rounded-md dark:border-none dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 focus:ring-2 ring-offset-current ring-offset-2  focus:outline-none"
						>
							Submit
						</button>
					</form>
				) : (
					<>
						<div className="flex items-center w-full gap-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-900">
							<textarea
								ref={tokenInputRef}
								onClick={(e) => tokenInputRef?.current?.select()}
								className="w-full px-4 py-1 rounded dark:bg-gray-50 dark:text-black"
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
								className="p-2 transition bg-gray-200 rounded focus:outline-none hover:bg-gray-300 dark:bg-gray-600 bg-blend-multiply"
							>
								{isCopied ? (
									<HiClipboardCheck className="w-5 h-5" />
								) : (
									<HiOutlineClipboard className="w-5 h-5" />
								)}
							</button>
						</div>
						<Link href="/settings/tokens">
							<a className="flex items-center px-4 py-2 mx-auto text-sm font-medium text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
								<HiArrowLeft className="mr-2" />
								Saved token? Go back to tokens list
							</a>
						</Link>
					</>
				)}
			</div>
		</SettingsPageWrapper>
	);
}
