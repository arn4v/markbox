import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import { AppLayout } from "~/modules/dashboard/layouts/App.layout";

const TagPage = () => {
	const { tag } = useRouter().query as { tag: string };

	return (
		<>
			<NextSeo title="Dashboard" noindex />
			<AppLayout tag={tag} />
		</>
	);
};

export default TagPage;
