import Spinner from "./Spinner";

export default function LoadingPage() {
	return (
		<div className="grid place-items-center h-screen w-screen bg-gray-50 dark:bg-black">
			<Spinner />
		</div>
	);
}
