import create from "zustand";
import { SortBy } from "./types";

interface DashboardStoreState {
	tag: string;
	sort: SortBy;
	cursor: string;
	edit_mode: {
		isEnabled: boolean;
		onToggle: () => void;
		onEnable: () => void;
		onDisable: () => void;
	};
	setCursor(cursor: string): void;
	setTag(tag: string): void;
	setSort(type: SortBy): void;
}

const useDashboardStore = create<DashboardStoreState>((set) => ({
	tag: "All",
	sort: "created_at_desc",
	cursor: "",
	edit_mode: {
		isEnabled: false,
		onToggle() {
			set((prev) => ({
				edit_mode: { ...prev.edit_mode, isEnabled: !prev.edit_mode.isEnabled },
			}));
		},
		onEnable() {
			set((prev) => ({
				edit_mode: { ...prev.edit_mode, isEnabled: true },
			}));
		},
		onDisable() {
			set((prev) => ({
				edit_mode: { ...prev.edit_mode, isEnabled: false },
			}));
		},
	},
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
