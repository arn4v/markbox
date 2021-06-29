import NextImage from "~/components/NextImage";

const Hero = () => {
	return (
		<section className="text-blueGray-700">
			<div className="container flex flex-col px-5 py-24 mx-auto lg:items-center">
				<div className="flex flex-col w-full mb-8 text-left lg:text-center">
					<h1 className="mb-6 text-2xl font-semibold tracking-tighter text-black sm:text-5xl title-font">
						{" "}
						API-first bookmarking tool <br className="md:hidden" /> for
						developers.{" "}
					</h1>
				</div>

				<div className="flex mb-8 justify-left lg:justify-center ">
					<button className="flex items-center px-6 py-2 mt-auto mr-3 font-semibold text-blue-800 transition duration-500 ease-in-out transform bg-blue-100 rounded-lg hover:bg-blue-200 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
						Sign in
					</button>
					<button className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
						Sign up
					</button>
				</div>
				<div className="flex items-center justify-center w-full">
					<NextImage
						src="/static/dashboard-desktop.png"
						alt="Bookmarky dashboard"
						height={687}
						width={1200}
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
