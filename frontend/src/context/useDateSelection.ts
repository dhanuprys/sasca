import { create } from "zustand";

interface DateSelectionState {
    dates: Set<string>;
    add: (date: string) => void;
    delete: (date: string) => void;
    clear: () => void;
}

const useDateSelection = create<DateSelectionState>((set, get) => ({
    dates: new Set(),
    add(date: string) {
        const dates = get().dates;

        set({
            dates: dates.add(date)
        })
    },
    delete(date: string) {
        const dates = get().dates;

        dates.delete(date);

        set({
            dates
        });
    },
    clear() {
        const dates = get().dates;

        dates.clear();

        set({
            dates
        })
    }
}));

export default useDateSelection;