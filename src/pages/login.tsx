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
			<div className="flex flex-col items-center justify-center w-screen min-h-screen gap-8 text-black bg-blueGray-50 dark:bg-blueGray-800 dark:text-white">
				<div className="grid w-5/6 text-2xl font-bold lg:w-1/3 place-items-center">
					Login
				</div>
				{router.query?.message && (
					<InfoBox
						className="justify-center w-5/6 mx-auto lg:w-1/3"
						text={router.query?.message as string}
						bgColor="indigo-200"
						textColor="indigo-700"
					/>
				)}
				<div className="w-5/6 px-10 py-6 bg-white rounded-lg shadow-lg lg:w-1/3 dark:bg-blueGray-700">
					<form
						className="flex flex-col items-start justify-center w-full h-full gap-5"
						onSubmit={(e) => {
							e.preventDefault();
							handleLogin(state);
						}}
					>
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							className="w-full border border-gray-200 rounded focus:outline-none focus:ring-2 ring-blue-600 focus:border-transparent dark:border-gray-400 dark:bg-blueGray-600 dark:focus:bg-blueGray-500"
							autoComplete="email"
							onChange={(e) =>
								setState((prev) => ({ ...prev, email: e.target.value }))
							}
							required
						/>
						<label htmlFor="password">Password</label>
						<input
							id="password"
							className="w-full border border-gray-200 rounded focus:outline-none focus:ring-2 ring-blue-600 focus:border-transparent dark:border-gray-400 dark:bg-blueGray-600 dark:focus:bg-blueGray-500"
							type="password"
							onChange={(e) =>
								setState((prev) => ({ ...prev, password: e.target.value }))
							}
							autoComplete="current-password"
							required
						/>
						<button
							type="submit"
							className="w-20 py-2 ml-auto font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring ring-black"
						>
							Login
						</button>
					</form>
				</div>
				<div className="mx-auto">
					Don&apos;t have an account? Register{" "}
					<Link href="/register">
						<a className="text-blue-600 dark:text-blue-400 dark:hover:border-blue-600 hover:border-b dark:border-blue-400 pb-[1px]">
							here
						</a>
					</Link>
					.
				</div>
			</div>
		</>
	);
}
