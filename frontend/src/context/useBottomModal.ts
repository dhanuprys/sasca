import { ReactNode } from "react";
import { create } from "zustand";

interface BottomModalState {
    isOpen: boolean;
    content?: ReactNode;
    open: (content?: ReactNode) => void;
    close: () => void;
    closeAndClear: () => void;
}

const useBottomModalStore = create<BottomModalState>((set, get) => ({
    isOpen: false,
    open(content?: ReactNode) {
        set({
            isOpen: true,
            content: content || get().content
        })
    },
    close() {
        set({
            isOpen: false
        })
    },
    closeAndClear() {
        set({
            isOpen: false,
            content: null
        })
    }
}));

export default useBottomModalStore;