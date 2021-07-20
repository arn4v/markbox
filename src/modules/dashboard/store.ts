import create from "zustand";
import { SortBy } from "./types";

interface DashboardStoreState {
	tag: string;
	sort: SortBy;
	cursor: string;
	setCursor(cursor: string): void;
	setTag(tag: string): void;
	setSort(type: SortBy): void;
}

const useDashboardStore = create<DashboardStoreState>((set) => ({
	tag: "All",
	sort: "created_at_desc",
	cursor: "",
	setCursor(cursor) {
		set({ cursor });
	},
	setSort(type) {
		set({ sort: type });
	},
	setTag(tag) {
		set({ tag });
	},
}));

export default useDashboardStore;
