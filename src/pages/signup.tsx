import { useRouter } from "next/router";
import Link from "next/link";
import * as React from "react";
import InfoBox from "~/components/InfoBox";
import { useMutation } from "react-query";
import qs from "qs";
import { NextSeo } from "next-seo";

interface RegisterBody {
	email: string;
	password: string;
}

export default function RegisterPage() {
	const [state, setState] = React.useState<RegisterBody>({
		email: "",
		password: "",
	});
	const [error, setError] = React.useState<string>("");
	const router = useRouter();
	const { mutate: handleRegister } = useMutation(
		"register",
		async (variables: RegisterBody) => {
			return await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(variables),
			}).then((res) => res.json());
		},
		{
			onSuccess(res) {
				switch (res.code) {
					case "invalid_password":
						setError(res.message);
						break;
					case "successful":
						router.push("/login");
						break;
					case "user_conflict": {
						router.push(
							"/login?" +
								qs.stringify({
									message: res.message,
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
			<NextSeo title="Sign up" />
			<div className="flex flex-col items-center justify-center w-screen min-h-screen gap-8 bg-blueGray-50 dark:bg-blueGray-800">
				<div className="grid w-5/6 text-2xl font-bold lg:w-1/3 place-items-center">
					Sign up
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
							setError("");
							handleRegister(state);
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
							autoComplete="new-password"
							required
						/>
						{error.length > 0 && (
							<InfoBox
								bgColor="red-200"
								textColor="red-600"
								text={error}
								className="w-full"
							/>
						)}
						<button
							type="submit"
							className="w-20 py-2 ml-auto font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
						>
							Register
						</button>
					</form>
				</div>
				<div className="mx-auto">
					Already have an account? Login{" "}
					<Link href="/login">
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
