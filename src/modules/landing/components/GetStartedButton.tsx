import clsx from "clsx";
import { HiArrowRight } from "react-icons/hi";
import CustomLink from "~/components/CustomLink";
import { useAuth } from "~/hooks/use-auth";

export const GetStartedButton = ({ className = "" }) => {
	const { isAuthenticated } = useAuth();

	return (
		<>
			<CustomLink
				data-test="homepage-get-started-link"
				href={isAuthenticated ? "/app" : "/api/auth/login"}
				className={clsx(
					"flex items-center justify-center px-2 lg:px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 gap-2",
					className,
				)}
			>
				{isAuthenticated ? (
					<>
						Dashboard <HiArrowRight />
					</>
				) : (
					<>
						Get started
						<HiArrowRight />
					</>
				)}
			</CustomLink>
		</>
	);
};
