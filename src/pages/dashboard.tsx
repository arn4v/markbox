import * as React from "react";
import { useAuth } from "~/components/AuthProvider";

export default function HomePage() {
	const { user } = useAuth(true);

	return (
		<div className="h-screen w-screen bg-gray-900 flex flex-col">
			<div className="h-full "></div>
		</div>
	);
}