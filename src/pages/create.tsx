import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "~/hooks/use-auth";
import { CreateForm } from "~/modules/common/components/Create";
import Navbar from "~/modules/dashboard/components/Navbar";

interface Props {
	title?: string;
	url?: string;
}

const CreatePage = ({}: Props) => {
	const router = useRouter();
	const {
		title = "",
		url = "",
		popup = false,
	} = router.query as unknown as {
		title?: string;
		url?: string;
		popup?: boolean;
	};
	useAuth(true);

	console.log(popup);

	return (
		<div className="flex flex-col w-screen min-h-screen scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scrollbar scrollbar-thin bg-white dark:bg-black items-center">
			<Navbar />
			<div className="grid grid-cols-3 w-11/12 lg:w-1/2 mx-auto mt-28 lg:mt-36">
				<div></div>
				<h1 className="whitespace-nowrap text-xl lg:text-3xl font-bold self-center justify-self-center">
					Create bookmark
				</h1>
			</div>
			<div className="flex flex-col gap-6 p-3 w-11/12 lg:p-6 dark:bg-gray-900 bg-white rounded-md border border-gray-300 lg:w-1/2 shadow-lg mt-8">
				<CreateForm
					onSuccess={() => {
						if (popup) {
							window.close();
						} else {
							router.push("/dashboard");
						}
					}}
					title={title}
					url={url}
				/>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	return {
		props: {
			title: (ctx?.query?.title as string) ?? "",
			url: (ctx?.query?.url as string) ?? "",
		},
		notFound: false,
	};
};

export default CreatePage;
