'use client';

import Image from 'next/image';
import { FaCrown } from 'react-icons/fa6';
import { RiCopperCoinFill, RiMedalLine } from 'react-icons/ri';
import { VscArrowSmallUp } from 'react-icons/vsc';

function LeaderBoard() {
    return (
        <div className="">
            <div className="rounded-t-xl flex flex-col gap-2 items-center justify-center px-4 py-8 bg-gradient-to-t from-black to-sky-950">
                <div className="w-[80px] h-[80px] relative mt-5">
                    <FaCrown className="absolute -top-1/2 left-1/2 w-[50px] h-[50px] -translate-x-1/2 text-yellow-500" />
                    <Image className="w-full h-full object-cover rounded-full bg-slate-100 ring-4 ring-yellow-500" src="/user.webp" width={100} height={100} alt="" />
                </div>
                <h2 className="font-semibold text-lg text-white">Gede Dhanu Purnayasa</h2>
                <div className="[&>*]:text-yellow-500 flex items-center gap-2">
                    <RiMedalLine />
                    <span className="font-semibold">234984</span>
                </div>
            </div>
            <div className="p-4 bg-black">

                <div className="grid grid-cols-12 gap-2 py-2 md:px-2 hover:bg-slate-900">
                    <div className="col-span-2 font-bold text-slate-400 text-xs md:text-sm border-r border-r-slate-800 flex items-center">1500</div>
                    <div className="col-span-8">
                        <h3 className="font-semibold text-white text-sm">Gede Dhanu Purnayasa</h3>
                        <div className="[&>*]:text-yellow-500 [&>*]:text-xs flex items-center gap-2">
                            <RiMedalLine />
                            <span className="font-semibold">234984</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="flex justify-end items-center text-green-500">
                            <VscArrowSmallUp className="!text-xl" />
                            <span className="font-semibold text-sm">1</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="rounded-b-xl bg-black py-4 flex justify-center">
                <span className="text-sm">Update terakhir ...</span>
            </div>
        </div>
    );
}

export default LeaderBoard;