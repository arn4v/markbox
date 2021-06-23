import { useRouter } from "next/router";
import Link from "next/link";
import * as React from "react";
import { useRegisterMutation } from "~/graphql/types.generated";

export default function RegisterPage() {
	const [state, setState] = React.useState<{ email: string; password: string }>(
		{
			email: "",
			password: "",
		},
	);
	const router = useRouter();
	const { mutate: handleRegister } = useRegisterMutation({
		onSettled: ({ register }, error) => {
			console.log(register, error);
			if (error) return;
			switch (register.code) {
				case "successful": {
					router.push("/login", {
						query: {
							message: register.message,
						},
					});
					break;
				}
				case "conflict": {
					router.push("/login", {
						query: {
							message: register.message,
						},
					});
					break;
				}
			}
		},
	});

	return (
		<div className="min-h-screen w-screen flex flex-col items-center justify-center bg-blueGray-50 gap-8">
			<div className="w-5/6 lg:w-2/5 text-2xl font-bold grid place-items-center">
				Register
			</div>
			<div className="w-5/6 lg:w-2/5 bg-white rounded-lg shadow-lg py-6 px-10">
				<form
					className="h-full w-full flex flex-col items-start justify-center gap-5"
					onSubmit={(e) => {
						e.preventDefault();
						handleRegister(state);
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
						className="bg-blue-500 hover:bg-blue-600 w-20 rounded font-medium text-white py-2 ml-auto">
						Register
					</button>
				</form>
			</div>
			<div className="mx-auto">
				Already have an account? Login{" "}
				<Link href="/login">
					<a className="text-blue-600 hover:border-b border-blue-600 pb-[1px]">
						here
					</a>
				</Link>
				.
			</div>
		</div>
	);
}
