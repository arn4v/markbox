import { useRouter } from "next/router";
import React from "react";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import { trpc } from "~/lib/trpc";
import EditForm from "~/modules/common/components/Edit/EditForm";
import Navbar from "~/modules/dashboard/components/Navbar";

const EditPage = () => {
	const router = useRouter();
	const id = router.query.id as string;
	const { isLoading } = trpc.useQuery(["bookmarks.byId", id]);

	useAuth(true);

	if (isLoading) return <LoadingPage />;

	return (
		<div className="flex flex-col w-screen min-h-screen scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scrollbar scrollbar-thin bg-white dark:bg-black items-center">
			<Navbar />
			<div className="grid grid-cols-3 w-11/12 lg:w-1/2 mx-auto mt-28 lg:mt-36">
				<div></div>
				<h1 className="whitespace-nowrap text-xl lg:text-3xl font-bold self-center justify-self-center">
					Edit bookmark
				</h1>
			</div>
			<div className="flex flex-col gap-6 p-3 w-11/12 lg:p-6 dark:bg-gray-900 bg-white rounded-md border border-gray-300 lg:w-1/2 shadow-lg mt-8">
				<EditForm id={id} onSuccess={() => router.push("/dashboard")} />
			</div>
		</div>
	);
};

export default EditPage;
