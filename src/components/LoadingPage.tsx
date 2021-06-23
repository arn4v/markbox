import Spinner from "./Spinner";

export default function LoadingPage() {
	return (
		<div className="grid place-items-center h-screen w-screen bg-blueGray-50">
			<Spinner />
		</div>
	);
}
