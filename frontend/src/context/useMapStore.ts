import { create } from "zustand";

interface MapState {
    previousCoordinates: [number, number] | null;
    isAllowUpdate: boolean;
    allowUpdate: () => void;
    restrictUpdate: () => void;
    setPreviousCoordinates: (coordinates: [number, number] | null) => void;
}

const useMapStore = create<MapState>((set) => ({
    setPreviousCoordinates: (coordinates) => {
        set({
            previousCoordinates: coordinates
        })
    },
    previousCoordinates: null,
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