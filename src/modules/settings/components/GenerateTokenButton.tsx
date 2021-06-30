import clsx from "clsx";
import { useRouter } from "next/router";

export default function GenerateTokenButton({
	className,
	...props
}: Omit<JSX.IntrinsicElements["button"], "onClick">) {
	const router = useRouter();

	return (
		<button
			className={clsx([
				"flex items-center px-4 py-1 mt-auto text-sm font-medium text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2",
				className,
			])}
			onClick={() => router.push("/settings/tokens/new")}
			{...props}
		>
			Generate new token
		</button>
	);
}
