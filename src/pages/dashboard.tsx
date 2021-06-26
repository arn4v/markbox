import dynamic from "next/dynamic";
import DashboardPage from "~/modules/dashboard/DashboardPage";

const DashboardPageCSR = dynamic(Promise.resolve(DashboardPage), {
	ssr: false,
});

export default DashboardPageCSR;
