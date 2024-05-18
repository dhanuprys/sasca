import { ReactNode } from "react";
import { create } from "zustand";

interface BottomModalState {
    isOpen: boolean;
    title?: ReactNode;
    content?: ReactNode;
    open: (content?: ReactNode, title?: string) => void;
    close: () => void;
    closeAndClear: () => void;
}

const useBottomModalStore = create<BottomModalState>((set, get) => ({
    isOpen: false,
    open(content?: ReactNode, title?: string) {
        const current = get();

        set({
            isOpen: true,
            title: title || current.title,
            content: content || current.content
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
            title: null,
            content: null
        })
    }
}));

export default useBottomModalStore;