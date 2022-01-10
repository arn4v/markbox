import create from "zustand";
import { SortBy } from "./types";

interface State {
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
		sort: SortBy;
		cursor: string;
		actions: {
			setCursor(cursor: string): void;
			setTag(tag: string): void;
			setSort(type: SortBy): void;
		};
	};
}

export const useStore = create<State>((set) => ({
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
		sort: "created_at_desc",
		cursor: "",
		actions: {
			setCursor(cursor) {
				set((prev) => ({ dashboard: { ...prev.dashboard, cursor } }));
			},
			setSort(sort) {
				set((prev) => ({ dashboard: { ...prev.dashboard, sort } }));
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
