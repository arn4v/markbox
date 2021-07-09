import create from "zustand";

interface CreateDrawerStore {
	isOpen: boolean;
	onOpen(cb?: () => void): void;
	onClose(cb?: () => void): void;
}

const useStore = create<CreateDrawerStore>((set) => ({
	isOpen: false,
	onOpen(cb) {
		set({ isOpen: true });
		if (cb) cb();
	},
	onClose(cb) {
		set({ isOpen: false });
		if (cb) cb();
	},
}));

export default useStore;
