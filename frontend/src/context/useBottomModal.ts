import { ReactNode } from "react";
import { create } from "zustand";

interface BottomModalState {
    isOpen: boolean;
    title?: ReactNode;
    content?: ReactNode;
    safeHeight?: boolean;
    open: (content?: ReactNode, title?: string, safeHeight?: boolean) => void;
    close: () => void;
    closeAndClear: () => void;
}

const useBottomModalStore = create<BottomModalState>((set, get) => ({
    isOpen: false,
    open(content?: ReactNode, title?: string, safeHeight?: boolean) {
        const current = get();

        set({
            isOpen: true,
            title: title || current.title,
            content: content || current.content,
            safeHeight: safeHeight !== undefined ? safeHeight : true
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
            content: null,
            safeHeight: true
        })
    }
}));

export default useBottomModalStore;