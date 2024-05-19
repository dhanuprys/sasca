'use client';

import useBottomModalStore from "@/context/useBottomModal";
import CommonWrapper from "@/wrappers/CommonWrapper";
import { AnimatePresence, motion } from "framer-motion";

function BottomModal() {
    const { isOpen, title, content, closeAndClear } = useBottomModalStore();

    return (
        <AnimatePresence>
            {
                isOpen
                && <div className="fixed shadow-xl left-0 top-0 w-screen h-screen z-[650]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAndClear}
                        className="absolute top-0 left-0 w-screen h-screen bg-black"></motion.div>
                    <motion.div
                        initial={{ translateY: '100%' }}
                        exit={{ translateY: '100%' }}
                        animate={{ translateY: 0 }}
                        transition={{ bounce: false }}
                        className="absolute bottom-0 left-0 w-full">
                        <div className="bg-white shadow-xl p-4 rounded-t-xl">
                            {/* HEADER */}
                            <div
                                onDoubleClick={closeAndClear}
                                className="pb-4 flex flex-col gap-2 items-center justify-center">
                                <div className="w-full">
                                    <div className="h-2 bg-slate-200 rounded-full mx-auto w-[150px]"></div>
                                </div>
                                <h1 className="text-xl text-center font-semibold py-4">{title}</h1>
                            </div>

                            {/* CONTENT */}
                            <CommonWrapper className="min-h-[300px] overflow-auto max-h-[60vh]">
                                {content}
                                <div className="min-h-14"></div>
                            </CommonWrapper>
                        </div>
                    </motion.div>
                </div>
            }
        </AnimatePresence>
    );
}

export default BottomModal;