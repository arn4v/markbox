import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import * as React from "react";
import { useMutation } from "react-query";
import axios, { Response } from "redaxios";
import InfoBox from "~/components/InfoBox";

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
			onError(error: Response<any>) {
				if (error?.data?.code === "invalid_password") {
					setError("The password you entered is wrong, please try again.");
				}
			},
		},
	);

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setError(undefined);
		setState((prev) => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	return (
		<>
			<NextSeo title="Login" />
			<div className="flex flex-col items-center justify-center w-screen min-h-screen gap-8 text-black bg-gray-50 dark:bg-black dark:text-white">
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
				<div className="w-5/6 px-6 py-6 bg-white rounded-lg shadow-lg lg:px-10 lg:w-1/3 dark:bg-gray-900">
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
							className="w-full border border-gray-200 rounded focus:outline-none focus:ring-2 ring-blue-600 focus:border-transparent dark:border-gray-400 dark:bg-gray-600 dark:focus:bg-gray-500"
							autoComplete="email"
							onChange={onChange}
							required
						/>
						<label htmlFor="password">Password</label>
						<input
							id="password"
							className="w-full border border-gray-200 rounded focus:outline-none focus:ring-2 ring-blue-600 focus:border-transparent dark:border-gray-400 dark:bg-gray-600 dark:focus:bg-gray-500"
							type="password"
							onChange={onChange}
							autoComplete="current-password"
							required
						/>
						{error && (
							<InfoBox
								text={error}
								bgColor="red-200"
								textColor="red-800"
								className="w-full text-sm lg:text-base"
							/>
						)}
						<button
							type="submit"
							className="px-6 py-2 ml-auto text-sm font-medium text-white transition bg-blue-600 rounded lg:w-auto lg:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
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
