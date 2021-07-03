import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import * as React from "react";
import { useMutation } from "react-query";
import InfoBox from "~/components/InfoBox";

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

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setError(undefined);
		setState((prev) => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	return (
		<>
			<NextSeo title="Sign up" />
			<div className="flex flex-col items-center justify-center w-screen min-h-screen gap-8 bg-gray-50 dark:bg-black">
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
				<div className="w-5/6 px-6 py-6 bg-white rounded-lg shadow-lg lg:px-10 lg:w-1/3 dark:bg-gray-900">
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
							className="px-2 py-2 ml-auto text-sm font-medium text-white transition bg-blue-600 rounded lg:text-base lg:px-6 hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
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
