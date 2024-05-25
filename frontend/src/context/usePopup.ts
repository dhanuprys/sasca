import { ReactNode } from "react";
import { create } from "zustand";

interface PopupState {
    _stacks: { id: string, content: ReactNode }[];
    addPopup: (id: string, content: ReactNode) => void;
    closePopup: (id: string) => void;
    clearPopup: () => void;
}

const usePopup = create<PopupState>((set, get) => ({
    _stacks: [],
    addPopup(id: string, content: ReactNode) {
        const currentStacks = get()._stacks
        
        currentStacks.push({
            id,
            content
        });

        set({
            _stacks: currentStacks
        });
    },
    closePopup(id: string) {
        const currentStacks = get()._stacks;

        set({
            _stacks: currentStacks.filter((stack) => stack.id !== id)
        });
    },
    clearPopup() {
        set({
            _stacks: []
        });
    }
}));

export default usePopup;