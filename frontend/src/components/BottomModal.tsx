'use client';

import useBottomModalStore from "@/context/useBottomModal";
import CommonWrapper from "@/wrappers/CommonWrapper";
import { AnimatePresence, motion } from "framer-motion";

function BottomModal() {
    const { isOpen, content, closeAndClear } = useBottomModalStore();

    return (
        <AnimatePresence>
            {
                isOpen
                && <div onClick={closeAndClear} className="fixed shadow-xl left-0 top-0 w-screen h-screen z-[650]">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }} className="absolute top-0 left-0 w-screen h-screen bg-black"></motion.div>
                    <motion.div initial={{ translateY: '100%' }} exit={{ translateY: '100%' }} animate={{ translateY: 0 }} transition={{ bounce: false }} className="absolute bottom-0 left-0 w-full">
                        <div className="bg-white shadow-xl p-4 rounded-t-xl min-h-[300px] overflow-auto max-h-[70vh]">
                            <CommonWrapper>
                                <div className="mb-8 h-2 bg-slate-200 rounded-full w-1/3 mx-auto"></div>
                                
                                <div>
                                    {content}
                                </div>
                            </CommonWrapper>
                        </div>
                    </motion.div>
                </div>
            }
        </AnimatePresence>
    );
}

export default BottomModal;