import { useRouter } from "next/router";

const ProfileDropdown = () => {
	const router = useRouter();

	return (
		<button
			onClick={null}
			className="w-full text-white font-medium items-center justify-center hover:bg-blueGray-600 flex px-2 py-1.5 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg">
			Logout
		</button>
	);
};

export default ProfileDropdown;
