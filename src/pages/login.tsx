import { useRouter } from "next/router";
import Link from "next/link";
import * as React from "react";
import { useLoginMutation } from "~/graphql/types.generated";
import { useTokenStore } from "~/providers/TokenProvider";
import InfoBox from "~/components/InfoBox";

export default function RegisterPage() {
	const [state, setState] = React.useState<{ email: string; password: string }>(
		{
			email: "",
			password: "",
		},
	);
	const [error, setError] = React.useState<string>(undefined);
	const { setAccessToken } = useTokenStore();
	const router = useRouter();
	const { mutate: handleLogin } = useLoginMutation({
		onSuccess: ({ login }) => {
			switch (login.code) {
				case "successful": {
					router.push("/dashboard");
					break;
				}
				case "invalid_user": {
					router.push("/register", {
						query: {
							message:
								"Couldn't find an account with your email, please register and login again.",
						},
					});
					break;
				}
			}
		},
	});

	return (
		<div className="min-h-screen w-screen flex flex-col items-center justify-center bg-blueGray-50 gap-8">
			<div className="w-5/6 lg:w-1/3 text-2xl font-bold grid place-items-center">
				Login
			</div>
			{router.query?.message && (
				<InfoBox
					className="w-5/6 mx-auto lg:w-1/3 justify-center"
					text={router.query?.message as string}
					bgColor="blueGray-500"
					textColor="indigo-500"
				/>
			)}
			<div className="w-5/6 lg:w-1/3 bg-white rounded-lg shadow-lg py-6 px-10">
				<form
					className="h-full w-full flex flex-col items-start justify-center gap-5"
					onSubmit={(e) => {
						e.preventDefault();
						handleLogin(state);
					}}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						className="w-full focus:outline-none focus:ring-2 ring-blue-600 rounded border focus:border-transparent border-gray-200"
						autoComplete="email"
						onChange={(e) =>
							setState((prev) => ({ ...prev, email: e.target.value }))
						}
						required
					/>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						className="w-full focus:outline-none focus:ring-2 ring-blue-600 rounded border focus:border-transparent border-gray-200"
						type="password"
						onChange={(e) =>
							setState((prev) => ({ ...prev, password: e.target.value }))
						}
						autoComplete="new-password"
						required
					/>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 w-20 rounded font-medium text-white py-2 ml-auto focus:outline-none focus:ring ring-black">
						Login
					</button>
				</form>
			</div>
			<div className="mx-auto">
				Don't have an account? Register{" "}
				<Link href="/register">
					<a className="text-blue-600 hover:border-b border-blue-600 pb-[1px]">
						here
					</a>
				</Link>
				.
			</div>
		</div>
	);
}
