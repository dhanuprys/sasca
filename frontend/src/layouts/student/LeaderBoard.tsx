'use client';

import Skeleton from '@/components/Skeleton';
import { swrFetcher } from '@/utils/swrFetcher';
import { DateTime } from 'luxon';
import Image from 'next/image';
import { useMemo } from 'react';
import { FaCrown, FaRegCircle } from 'react-icons/fa6';
import { RiCopperCoinFill, RiMedalLine } from 'react-icons/ri';
import { VscArrowSmallDown, VscArrowSmallUp } from 'react-icons/vsc';
import useSWRImmutable from 'swr/immutable';

interface RankItemProps {
    name: string;
    points: number;
    rank: number;
    rankChange: number;
    previousRank: number;
}

function RankItem({ rank, rankChange, name, points, previousRank }: RankItemProps) {
    previousRank = previousRank || 0;

    return (
        <div className="grid grid-cols-12 gap-2 py-2 md:px-2 hover:bg-slate-300 px-2">
            <div className="col-span-1 font-bold text-slate-400 text-xs md:text-sm border-r border-r-slate-800 flex items-center">
                {rank}
            </div>
            <div className="col-span-9">
                <h3 className="font-semibold text-sm">{name}</h3>
                <div className="[&>*]:text-yellow-500 [&>*]:text-xs flex items-center gap-2">
                    <RiMedalLine />
                    <span className="font-semibold">{points}</span>
                </div>
            </div>
            <div className="col-span-2">
                {
                    rank < previousRank
                        ? <div className="flex justify-end items-center text-green-500">
                            <VscArrowSmallUp className="!text-xl" />
                            <span className="font-semibold text-sm">{rankChange}</span>
                        </div>
                        : rank > previousRank
                            ? <div className="flex justify-end items-center text-red-500">
                                <VscArrowSmallDown className="!text-xl" />
                                <span className="font-semibold text-sm">{rankChange}</span>
                            </div>
                            : <div className="flex justify-end items-center text-slate-300">
                                <FaRegCircle className="!text-xs" />
                            </div>
                }
            </div>
        </div>
    );
}

function LeaderBoard() {
    const { data: ranks, error } = useSWRImmutable(
        '/api/v1/student/rank',
        swrFetcher
    );

    const adoptedRank = useMemo(() => {
        if (!ranks || ranks.length < 1) return null;
        console.log(ranks[0].calculation_date);

        return {
            top: ranks[0],
            followers: ranks.slice(1),
            lastUpdate: DateTime.fromISO(ranks[0].calculation_date)
                                .setLocale('id')
                                .toFormat('dd LLLL yyyy - HH:mm:ss')
        }
    }, [ranks]);

    if (!ranks) {
        return <Skeleton style={{ height: '400px' }} />;
    }

    if (!adoptedRank) {
        return <div>Halaman ini belum tersedia</div>
    }

    return (
        <div className="">
            <div className="sticky top-0 rounded-t-xl flex flex-col gap-4 items-center justify-center px-4 py-8">
                <h1 className="text-2xl font-semibold pb-8">Top 100</h1>

                <div className="w-[80px] h-[80px] relative mt-5">
                    <div className="absolute top-1/2 left-1/2 glowing-effect"></div>
                    <FaCrown className="absolute -top-1/2 left-1/2 w-[50px] h-[50px] -translate-x-1/2 text-yellow-500" />
                    <Image className="relative z-[20] w-full h-full object-cover rounded-full bg-slate-100 ring-4 ring-yellow-500" src="/user.webp" width={100} height={100} alt="" />
                </div>
                <h2 className="font-bold text-slate-800 text-lg px-4 text-center relative z-[20]">{adoptedRank.top.name}</h2>
                <div className="[&>*]:text-yellow-500 flex items-center gap-2 relative z-[20]">
                    <RiMedalLine />
                    <span className="font-semibold">{adoptedRank.top.total_points}</span>
                </div>
            </div>
            <div className="py-6 shadow rounded-t-3xl relative bg-white">
                <div className="max-w-[28rem] md:max-w-[40rem] mx-auto">
                {
                    adoptedRank && adoptedRank.followers.map((follower: any) => {
                        return <RankItem
                            rank={follower.rank}
                            rankChange={follower.rank_change}
                            name={follower.name}
                            points={follower.total_points}
                            previousRank={follower.previous_rank} />
                    })
                }
                </div>
            </div>

            <div className="rounded-b-xl py-4 flex justify-center">
                <span className="text-sm">{adoptedRank.lastUpdate}</span>
            </div>
        </div>
    );
}

export default LeaderBoard;