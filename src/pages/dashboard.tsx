import * as React from "react";
import { HiPlus } from "react-icons/hi";
import { useAuth } from "~/providers/AuthProvider";
import { Logo } from "~/components/Logo";
import CreateBookmarkButton from "~/modules/dashboard/components/CreateBookmarkButton";
import Collections from "~/components/Collections";
import Navbar from "~/modules/dashboard/components/Navbar";
import LoadingPage from "~/components/LoadingPage";
import { useRouter } from "next/router";

export default function HomePage() {
	const { isLoading } = useAuth(true);

	if (isLoading) <LoadingPage />;

	return (
		<div className="h-screen w-screen bg-blueGray-50 flex">
			<div className="h-full w-1/5 bg-white shadow-xl flex flex-col py-8 gap-6">
				<Logo className="fill-current text-black mx-6" />
				<div className="w-full px-6">
					<CreateBookmarkButton />
				</div>
				<Collections />
			</div>
			<div className="h-full flex-grow flex flex-col">
				<Navbar />
			</div>
		</div>
	);
}
