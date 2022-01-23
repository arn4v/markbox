import Avatar from "boring-avatars";
import clsx from "clsx";
import ms from "ms";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import QueryString from "qs";
import * as React from "react";
import { HiOutlineShare } from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import { CopyCode } from "~/components/CopyCode";
import Popup, { PopupProps } from "~/components/Popup";
import { getDeploymentUrl } from "~/lib/misc";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import { prisma, trpcServerClient } from "~/lib/utils.server";
import SortButton from "~/modules/dashboard/components/SortButton";
import { Navbar } from "~/modules/landing/components/Navbar";
import { useStore } from "~/store";

interface Props {
	id: string;
	initialData: InferQueryOutput<"public.collections.byId">;
}

const SharePopup = ({
	id,
	className,
	children,
	placement = "bottom-start",
}: {
	id: string;
	children?: React.ReactNode;
	className?: string;
	placement?: PopupProps["placement"];
}) => {
	const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

	return (
		<>
			<Popup
				isOpen={isOpen}
				onDismiss={onClose}
				placement={placement}
				trigger={
					<button
						onClick={onToggle}
						className={clsx([
							"h-full border border-gray-200 rounded-lg px-4 shadow hover:shadow-md transition",
							children ? "flex items-center space-x-2" : "aspect-1",
							className,
						])}
					>
						<HiOutlineShare />
						{children}
					</button>
				}
			>
				<div className="bg-white shadow-xl border border-gray-200 p-6 flex flex-col space-y-4 mt-2 rounded-lg">
					<div>
						<p className="mb-2 font-medium">Share URL</p>
						<CopyCode value={`${getDeploymentUrl()}/share/${id}`} />
					</div>
					<div>
						<p className="mb-2 font-medium">Embed Code</p>
						<CopyCode
							value={`<iframe src="${getDeploymentUrl()}/share/${id}" frameborder="0" allowfullscreen></iframe>`}
						/>
					</div>
				</div>
			</Popup>
		</>
	);
};

export default function PublicCollectionPage({ initialData }: Props) {
	const router = useRouter();
	const id = router.query.id as string;
	const sort = useStore((state) => state.sort.type);
	const { data } = trpc.useQuery(["public.collections.byId", { id, sort }], {
		initialData: initialData,
	});
	const [isIframe, setIsIframe] = React.useState(true);

	React.useEffect(() => {
		setIsIframe(window.location !== window.parent.location);
	}, []);

	return (
		<>
			<NextSeo
				title={`${data?.name} by ${data?.User?.name}`}
				openGraph={{
					title: `${data?.name} by ${data?.User?.name}`,
					description: `A Markbox Collection by ${data?.User?.name}`,
					type: "website",
					url: `${getDeploymentUrl()}/share/${data?.id}`,
					images: [
						{
							height: 630,
							width: 1200,
							url:
								`${getDeploymentUrl()}/api/og?` +
								QueryString.stringify({
									template: "collection",
									id: data?.id,
									name: data?.name,
									userName: data?.User?.name,
								}),
						},
					],
				}}
			/>
			<div className="bg-white h-screen w-screen relative">
				{!isIframe ? <Navbar /> : null}
				<div className="py-8 flex flex-col px-4 w-full lg:px-0 lg:w-2/3 mx-auto space-y-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Avatar name={data?.id} variant="marble" size={48} />
							<div className="block">
								<h3 className="text-lg font-bold">{data?.name}</h3>
								<p>By {data?.User?.name}</p>
							</div>
						</div>
						<div className="items-center space-x-4 hidden lg:flex">
							<SortButton />
							<SharePopup id={id} />
						</div>
					</div>
					<div className="w-full grid grid-cols-1 gap-2 lg:hidden">
						<SortButton
							className="w-full flex-grow items-center justify-center h-10"
							placement="bottom-end"
						>
							{" "}
							<span>Sort</span>
						</SortButton>
						<SharePopup
							id={id}
							className="flex-grow w-full justify-center h-10"
							placement="bottom-start"
						>
							{" "}
							<span>Share</span>
						</SharePopup>
					</div>
					<ol className="mt-8 list-decimal px-6">
						{data?.bookmarks?.map((item) => {
							return (
								<li key={item?.id} className="mb-1">
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={item?.url}
										className="text-cyan-600 underline hover:text-cyan-700"
									>
										{item?.title}
									</a>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	Props,
	{ id: string }
> = async ({ query, res }) => {
	const id = query.id as string;
	const data = await trpcServerClient.query("public.collections.byId", { id });

	if (!data?.isPublic) {
		return {
			notFound: true,
			redirect: {
				destination: "/404",
				permanent: false,
				statusCode: 404,
			},
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

	res?.setHeader(
		"Cache-Control",
		`s-maxage=1, stale-while-revalidate=${ms("1 hour") / 100}`,
	);

	return {
		props: {
			id,
			initialData: data,
		},
	};
};
