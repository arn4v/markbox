import clsx from "clsx";
import useStore from "../store";

const Sidebar: Component = () => {
	const { tab, setTab } = useStore();

	return (
		<div className="w-1/4 px-6 py-8 2xl:pr-6 2xl:px-0">
			<ul className="flex flex-col w-full gap-4">
				<li>
					<button
						className={clsx([
							"px-4 py-2 rounded-md w-full transition focus:outline-none",
							tab === "account" ? "bg-blueGray-600" : "bg-blueGray-700 hover:bg-blueGray-600",
						])}
						onClick={() => setTab("account")}>
						Account settings
					</button>
				</li>
				<li>
					<button
						className={clsx([
							"px-4 py-2 rounded-md w-full transition focus:outline-none",
							tab === "api_keys" ? "bg-blueGray-600" : "bg-blueGray-700 hover:bg-blueGray-600",
						])}
						onClick={() => setTab("api_keys")}>
						API Keys
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
