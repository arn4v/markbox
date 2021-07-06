import create from "zustand";

const useDashboardStore = create<{ tag: string; setTag(tag: string): void }>(
	(set) => ({
		tag: "All",
		setTag(tag: string) {
			set({ tag });
		},
	}),
);

export default useDashboardStore;
