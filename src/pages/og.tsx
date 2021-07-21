import { Logo } from "~/components/Logo";

const OpenGraphImage = () => {
	return (
		<div className="w-[1200px] h-[627px] bg-black flex items-center justify-center relative">
			<div className="w-96 h-64 blur-[350px] absolute bg-sky-400 rounded-full top-1/3 left-1/2 -translate-x-1/2 transform"></div>
			<div>
				<Logo className="text-white scale-[300%] m-0 p-0" />
			</div>
		</div>
	);
};

export default OpenGraphImage;
