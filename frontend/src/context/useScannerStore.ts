import { create } from "zustand";

type Coordinates = [number, number];

interface ScannerState {
    coordinates?: Coordinates;
    setCoordinates: (coordinates: Coordinates) => void;
}

const useScannerStore = create<ScannerState>((set) => ({
    setCoordinates: (coordinates: Coordinates) => {
        set({
            coordinates
        })
    }
}));

export default useScannerStore;