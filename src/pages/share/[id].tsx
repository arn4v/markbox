import { GetServerSideProps } from "next";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import { prisma, trpcServerClient } from "~/lib/utils.server";

interface Props {
	id: string;
	initialData: InferQueryOutput<"public.collections.byId">;
}

export default function PublicCollectionPage({ initialData, id }: Props) {
	const { data } = trpc.useQuery(["public.collections.byId", id], {
		initialData,
	});
	return null;
}

export const getServerSideProps: GetServerSideProps<
	Props,
	{ id: string }
> = async ({ query }) => {
	const id = query.id as string;
	const data = await trpcServerClient.query("public.collections.byId", id);

	if (!data?.isPublic) {
		return {
			notFound: true,
		};
	}

	await prisma.collection.update({
		where: {
			id,
		},
		data: {
			views: {
				increment: 1,
			},
		},
	});

	return {
		props: {
			id,
			initialData: data,
		},
	};
};
