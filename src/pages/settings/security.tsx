import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function AccountSecurityPage() {
	return (
		<SettingsPageWrapper>
			<div className="flex flex-col flex-grow gap-8 pl-12">
				<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
					<span className="text-xl font-bold">Generate new token</span>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
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
			</div>
		</SettingsPageWrapper>
	);
}
