export default function AddBookmarkButton() {
	return (
		<button
			className="absolute bottom-0 right-0 p-4 mb-6 mr-4 transition bg-indigo-500 rounded-full focus:outline-none focus:bg-indigo-600"
			onClick={showAddSheet}>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 12H6M12 6V12V6ZM12 12V18V12ZM12 12H18H12Z"
					stroke="white"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}
