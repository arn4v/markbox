import { useRouter } from "next/router";
import Link from "next/link";
import * as React from "react";
import qs from "qs";
import InfoBox from "~/components/InfoBox";
import { useMutation } from "react-query";
import axios from "redaxios";

interface LoginBody {
	email: string;
	password: string;
}

export default function RegisterPage() {
	const [state, setState] = React.useState<LoginBody>({
		email: "",
		password: "",
	});
	const router = useRouter();
	const [error, setError] = React.useState<string>(undefined);
	const { mutate: handleLogin } = useMutation(
		"login",
		async (variables: LoginBody) => axios.post("/api/auth/login", variables),
		{
			onSuccess: (res) => {
				switch (res.data.code) {
					case "successful": {
						router.push("/dashboard");
						break;
					}
					case "invalid_password": {
						setError("Wrong password.");
						break;
					}
					case "invalid_user": {
						router.push(
							"/register?" +
								qs.stringify({
									message:
										"Couldn't find an account with your email, please register and login again.",
								}),
						);
						break;
					}
				}
			},
		},
	);

	return (
		<>
			<div className="min-h-screen w-screen flex flex-col items-center justify-center bg-blueGray-50 dark:bg-gray-900 gap-8 text-black dark:text-white">
				<div className="w-5/6 lg:w-1/3 text-2xl font-bold grid place-items-center">
					Login
				</div>
				{router.query?.message && (
					<InfoBox
						className="w-5/6 mx-auto lg:w-1/3 justify-center"
						text={router.query?.message as string}
						bgColor="indigo-200"
						textColor="indigo-700"
					/>
				)}
				<div className="w-5/6 lg:w-1/3 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-6 px-10">
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
							className="w-full focus:outline-none focus:ring-2 ring-gray-700 rounded focus:border-transparent border-gray-200 dark:border-gray-600 border-2 dark:bg-gray-800 dark:caret-gray-400 caret-black focus:bg-gray-500"
							autoComplete="email"
							onChange={(e) =>
								setState((prev) => ({ ...prev, email: e.target.value }))
							}
							required
						/>
						<label htmlFor="password">Password</label>
						<input
							id="password"
							className="w-full focus:outline-none focus:ring-2 rounded focus:border-transparent border-gray-200 dark:border-gray-600 border-2 dark:bg-gray-800 dark:caret-gray-400 caret-black focus:bg-gray-500"
							type="password"
							onChange={(e) =>
								setState((prev) => ({ ...prev, password: e.target.value }))
							}
							autoComplete="new-password"
							required
						/>
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-600 w-20 rounded font-medium py-2 ml-auto focus:outline-none focus:ring ring-black text-white">
							Login
						</button>
					</form>
				</div>
				<div className="mx-auto">
					Don&apos;t have an account? Register{" "}
					<Link href="/register">
						<a className="text-blue-600 hover:border-b border-blue-600 pb-[1px]">
							here
						</a>
					</Link>
					.
				</div>
			</div>
		</>
	);
}
