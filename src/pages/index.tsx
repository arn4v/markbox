import Footer from "~/modules/landing/components/Footer";
import Hero from "~/modules/landing/components/Hero";
import Navbar from "~/modules/landing/components/Navbar";

export default function IndexPage() {
	return (
		<div className="h-screen w-screen bg-blueGray-50">
			<Navbar />
			<Hero />
			<Footer />
		</div>
	);
}
