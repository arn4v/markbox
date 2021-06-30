import { useRouter } from "next/router";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function TokensPage() {
	const router = useRouter();

	return (
		<SettingsPageWrapper>
			<div className="flex flex-col flex-grow gap-8">
				<div className="flex items-center justify-between w-full">
					<span>Personal access tokens</span>
					<button
						className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
						onClick={() => router.push("/settings/tokens/new")}
					>
						Generate new token
					</button>
				</div>
				<div></div>
			</div>
		</SettingsPageWrapper>
	);
}
