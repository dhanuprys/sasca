'use client';

import usePopup from "@/context/usePopup";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { IoIosClose } from "react-icons/io";

function PopupContainer() {
    const { _stacks, closePopup } = usePopup();

    if (!_stacks || _stacks.length <= 0) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-[999999]">
            {/* BACKGROUND */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} className="relative top-0 left-0 w-full h-full bg-black"></motion.div>

            {
                _stacks.map((stack: { id: string, content: ReactNode }) => {
                    return (
                        <div key={stack.id} className="absolute w-screen">
                            <div className="mx-auto p-4 max-w-[28rem] md:max-w-[40rem]">
                                <div className="bg-white p-4 rounded-xl min-h-[300px] md:min-h-[500px] max-h-[90vh] overflow-y-auto">
                                    {/* <div className="flex justify-end py-2">
                                        <IoIosClose onClick={() => closePopup(stack.id)} className="text-3xl" />
                                    </div> */}
                                    <div>
                                        {stack.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default PopupContainer;