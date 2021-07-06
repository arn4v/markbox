import isEqual from "lodash.isequal";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";
import QueryString from "qs";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { HiOutlineXCircle } from "react-icons/hi";
import Badge from "~/components/Badge";
import {
  Bookmark,
  CreateOrUpdateBookmarkTagInput,
  useGetAllTagsQuery,
  useGetBookmarkQuery,
  useUpdateBookmarkMutation
} from "~/graphql/types.generated";
import { useAuth } from "~/hooks/use-auth";
import useBreakpoints from "~/hooks/use-breakpoints";
import { getBookmarkById } from "~/lib/db";
import { jwtVerify } from "~/lib/utils.server";
import Navbar from "~/modules/dashboard/components/Navbar";

interface Props {
	id: string;
	data: Bookmark;
}

interface LocalState {
	title: string;
	url: string;
	tags: Record<string, CreateOrUpdateBookmarkTagInput>;
	tagsDisconnect: Record<string, CreateOrUpdateBookmarkTagInput>;
}

/**
 * The backend needs to be provided an array of objects
 * with following structure for it to be able to make the
 * database connections or create new tags if it doesn't
 * exist
 *
 * ```
 * {
 *  name: string
 * }
 * ```
 * Hence the requirement for transforming it
 */
const transformTags = (
	data: Bookmark["tags"],
): Record<string, CreateOrUpdateBookmarkTagInput> => {
	return data.reduce((acc, { name }) => {
		acc[name] = { name };
		return acc;
	}, {});
};

const EditPage = ({ data: initialData, id }: Props) => {
	const initialState: LocalState = {
		title: "",
		url: "",
		tags: {},
		tagsDisconnect: {},
	};
	const [state, setState] = React.useState<LocalState>(initialState);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);
	const router = useRouter();
	const { isLg } = useBreakpoints();
	const {} = useGetBookmarkQuery(
		{ id },
		{
			initialData: { bookmark: initialData },
			onSuccess(data) {
				if (isEqual(state, initialState)) {
					const { title, url, tags } = data.bookmark;
					setState((prev) => ({
						...prev,
						title,
						url,
						tags: transformTags(tags),
					}));
				}
			},
		},
	);
	const { data } = useGetAllTagsQuery();
	const { mutate } = useUpdateBookmarkMutation({
		onSuccess: (res) => {
			router.push("/dashboard");
		},
	});
	useAuth(true);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { title, url, tagsDisconnect } = state;
		const tags = Object.values(state.tags).reduce((acc, cur) => {
			if (tagsDisconnect[cur?.name]) delete tagsDisconnect[cur?.name];
			const existingTag = data.tags.find((item) => item.name === cur.name);
			if (existingTag) {
				acc.push({ id: existingTag.id });
			} else {
				acc.push(cur);
			}
			return acc;
		}, []);
		const _tagsDisconnect = Object.values(tagsDisconnect).reduce((acc, cur) => {
			const existingTag = data.tags.find((item) => item.name === cur.name);
			if (existingTag) {
				acc.push({ id: existingTag.id });
			}

			return acc;
		}, []);

		mutate({
			input: {
				id,
				title,
				url,
				tags,
				tagsDisconnect: _tagsDisconnect,
			},
		});
	};
	const { isAuthenticated } = useAuth();

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
				<form className="flex flex-col gap-4" onSubmit={onSubmit}>
					<div className="w-full">
						<label htmlFor="title" className="block">
							Name
						</label>
						<input
							id="title"
							autoComplete="off"
							type="text"
							className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-blue-600 ring-offset-2 caret-black"
							onChange={(e) =>
								setState((prev) => ({ ...prev, title: e.target.value }))
							}
							value={state.title}
							required
						/>
					</div>
					<div className="w-full">
						<label htmlFor="url" className="block">
							URL
						</label>
						<input
							id="url"
							type="url"
							className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-blue-600 ring-offset-2 caret-black"
							value={state.url}
							autoComplete="off"
							onChange={(e) =>
								setState((prev) => ({ ...prev, url: e.target.value }))
							}
							required
						/>
					</div>
					<div className="w-full">
						<label htmlFor="url" className="block">
							Tags
						</label>
						<div className="flex flex-wrap gap-2 mt-2">
							{Object.values(state.tags).map((item) => {
								return (
									<Badge
										key={item.name}
										title={item?.name}
										variant="outline"
										color="white"
										className="z-50"
									>
										<button
											type="button"
											onClick={() => {
												setState((prev) => {
													const tags = prev.tags;
													delete tags[item?.name];
													return {
														...prev,
														tags,
														tagsDisconnect: {
															...prev.tagsDisconnect,
															[item.name]: { name: item.name },
														},
													};
												});
											}}
										>
											<HiOutlineXCircle />
										</button>
									</Badge>
								);
							})}
						</div>
						<div className="flex w-full gap-6 mt-2">
							<input
								id="tag"
								ref={newTagInputRef}
								type="text"
								autoComplete="off"
								onChange={(e) => {
									let trimmedValue = e.target.value.trim();
									const lastIdx = trimmedValue.length - 1;
									if (trimmedValue.charAt(lastIdx) === ",") {
										trimmedValue = trimmedValue.slice(0, -1);
										setState((prev) => ({
											...prev,
											tags: {
												...prev.tags,
												[trimmedValue]: {
													name: trimmedValue,
												},
											},
										}));
										newTagInputRef.current.value = "";
									}
								}}
								className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-current ring-blue-600 ring-offset-2 caret-black"
								list="tags"
							/>
							<datalist id="tags">
								{data?.tags?.map((item) => {
									return <option key={item.id} value={item.name} />;
								})}
							</datalist>
						</div>
					</div>
					<button
						type="submit"
						className="px-4 py-2 mt-4 ml-auto text-white transition bg-blue-600 rounded-md ring-offset-current ring-offset-2 focus:ring-2 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

interface Query extends ParsedUrlQuery {
	id: string;
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async (
	ctx,
) => {
	const id = ctx.query.id as string;
	const cookies = nookies.get(ctx);
	console.log(cookies);
	const access_token = cookies.access_token;
	try {
		const { sub } = await jwtVerify(access_token);
		if (sub) {
			const data = await getBookmarkById({ id });
			return {
				props: {
					id,
					data,
				},
			};
		} else {
			nookies.destroy(ctx, "access_token");
			return {
				notFound: true,
				redirect: {
					destination:
						"/login?" +
						QueryString.stringify({
							message: "Unable to verify user, please login again.",
						}),
				},
			};
		}
	} catch (err) {
		nookies.destroy(ctx, "access_token");
		return {
			notFound: true,
			redirect: {
				destination:
					"/login?" +
					QueryString.stringify({
						message: "Unable to verify user, please login again.",
					}),
			},
		};
	}
};

export default EditPage;
