import create from "zustand";
import type { SortBy } from "./types";

interface State {
	sort: {
		type: SortBy;
		actions: {
			setSort(type: SortBy): void;
		};
	};
	createBookmark: {
		isOpen: boolean;
		actions: {
			onOpen(cb?: () => void): void;
			onClose(cb?: () => void): void;
		};
	};
	editMode: {
		isEnabled: boolean;
		actions: {
			onToggle: () => void;
			onEnable: () => void;
			onDisable: () => void;
		};
	};
	dashboard: {
		tag: string;
		cursor: string;
		actions: {
			setCursor(cursor: string): void;
			setTag(tag: string): void;
		};
	};
}

export const useStore = create<State>((set) => ({
	sort: {
		type: "created_at_desc",
		actions: {
			setSort(sort) {
				set((prev) => ({ sort: { ...prev.sort, type: sort } }));
			},
		},
	},
	createBookmark: {
		isOpen: false,
		actions: {
			onOpen(cb) {
				set((prev) => ({
					createBookmark: { ...prev.createBookmark, isOpen: true },
				}));
				if (cb) cb();
			},
			onClose(cb) {
				set((prev) => ({
					createBookmark: { ...prev.createBookmark, isOpen: false },
				}));
				if (cb) cb();
			},
		},
	},
	dashboard: {
		tag: "All",
		cursor: "",
		actions: {
			setCursor(cursor) {
				set((prev) => ({ dashboard: { ...prev.dashboard, cursor } }));
			},
			setTag(tag) {
				set((prev) => ({ dashboard: { ...prev.dashboard, tag } }));
			},
		},
	},
	editMode: {
		isEnabled: false,
		actions: {
			onToggle() {
				set((prev) => ({
					editMode: { ...prev.editMode, isEnabled: !prev.editMode.isEnabled },
				}));
			},
			onEnable() {
				set((prev) => ({
					editMode: { ...prev.editMode, isEnabled: true },
				}));
			},
			onDisable() {
				set((prev) => ({
					editMode: { ...prev.editMode, isEnabled: false },
				}));
			},
		},
	},
}));
