import create from "zustand";
import _produce from "immer";
import { Bookmark } from "./graphql/types.generated";

interface Actions {
	hideEditSheet(): void;
	showEditSheet(data: Bookmark): void;
	toggleSettings(): void;
}

interface State {
	edit: {
		show: boolean;
		data: Bookmark;
	};
	settings: boolean;
	actions: Actions;
}

const produce = (fn: (state: Omit<State, "actions">) => void) => _produce(fn);

export const useStore = create<State>((set, get) => ({
	edit: {
		show: false,
		data: undefined,
	},
	settings: false,
	actions: {
		toggleSettings() {
			set((state) => {});
		},
		hideEditSheet() {
			set(
				produce((state) => {
					state.edit.show = false;
				}),
			);
		},
		showEditSheet(data) {
			set(
				produce((state) => {
					state.edit.show = true;
					state.edit.data = data;
				}),
			);
		},
	},
}));
