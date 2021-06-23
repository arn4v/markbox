import { HiPlus } from "react-icons/hi";

export default function CreateBookmarkButton() {
	return (
		<button className="bg-gradient-to-r from-blue-600 to-blue-900 w-full h-14 focus:outline-none focus:ring ring-black rounded-full text-white flex items-center justify-center gap-2 text-lg font-medium hover:from-blue-500 hover:to-blue-700 transition-colors ease-in-out duration-75">
			<HiPlus className="h-8 w-8" />
			Create new bookmark
		</button>
	);
}
