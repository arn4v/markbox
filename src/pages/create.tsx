import { getSession, UserProfile } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import useIsPwa from "~/hooks/use-pwa";
import { prisma } from "~/lib/utils.server";
import { CreateForm } from "~/modules/common/components/Create";
import Navbar from "~/modules/dashboard/components/Navbar";

const CreatePage = () => {
	const router = useRouter();
	const isPwa = useIsPwa();
	const [{ title, url, popup }, setState] = React.useState({
		title: null,
		url: null,
		description: null,
		popup: false,
	});
	const { isLoading } = useAuth(true);
	const [isMounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		// Decode window.location query params
		const { searchParams } = new URL(window.location.href);
		const title = searchParams.get("title");
		const url = searchParams.get("url");
		const description = searchParams.get("description");
		const popup = !!searchParams.get("popup") ?? false;
		setState({
			title,
			url: url ? decodeURIComponent(url) : "",
			description,
			popup,
		});
		setMounted(true);
	}, []);

	if (isLoading || !isMounted) return <LoadingPage />;

	return (
		<div
			data-test="create-root"
			className="flex flex-col w-screen min-h-screen scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scrollbar scrollbar-thin bg-white dark:bg-black items-center"
		>
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
						if (popup && !isPwa) {
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

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
	query,
}) => {
	if (query?.url) {
		const session = getSession(req, res);

		if (!session) {
			return { props: {} };
		}

		const user = await prisma.user.findUnique({
			where: {
				auth0Id: (session.user as UserProfile).sub,
			},
		});
		const bookmark = await prisma.bookmark.findFirst({
			where: {
				url: query?.url as string,
				userId: user.id,
			},
		});

		if (bookmark && bookmark?.url === query?.url) {
			res.statusCode = 302;
			res.setHeader("Location", `/edit/${bookmark.id}`);
			res.end();
		}

		return {
			props: {},
		};
	}

	return { props: {} };
};

export default CreatePage;
