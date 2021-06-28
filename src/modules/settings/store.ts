import create from "zustand";

interface State {
	tab: "account" | "api_keys";
}

interface Actions {
	setTab(tab: State["tab"]): void;
}

const useStore = create<State & Actions>((set) => ({
	tab: "account",
	setTab(tab: State["tab"]) {
		set({ tab });
	},
}));

export default useStore;
