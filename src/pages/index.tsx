import Footer from "~/modules/landing/components/Footer";
import Header from "~/modules/landing/components/Header";
import Navbar from "~/modules/landing/components/Navbar";

export default function IndexPage() {
	return (
		<div className="w-screen h-screen overflow-hidden bg-gray-50 dark:bg-black">
			<Navbar />
			<Header />
			<Footer />
		</div>
	);
}
