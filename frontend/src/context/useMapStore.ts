import { create } from "zustand";

interface MapState {
    isAllowUpdate: boolean;
    allowUpdate: () => void;
    restrictUpdate: () => void;
}

const useMapStore = create<MapState>((set) => ({
    isAllowUpdate: true,
    allowUpdate: () => {
        set({
            isAllowUpdate: true
        })
    },
    restrictUpdate: () => {
        set({
            isAllowUpdate: false
        });
    }
}));

export default useMapStore;