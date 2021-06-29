import Footer from "~/modules/landing/components/Footer";
import Header from "~/modules/landing/components/Header";
import Navbar from "~/modules/landing/components/Navbar";

export default function IndexPage() {
	return (
		<div className="w-screen h-screen overflow-hidden bg-blueGray-50 dark:bg-blueGray-800">
			<Navbar />
			<Header />
			<Footer />
		</div>
	);
}
