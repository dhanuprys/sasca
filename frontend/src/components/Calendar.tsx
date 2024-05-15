'use client';

import { DateTime } from "luxon";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function CalendarHeader() {
    return (
        <>
            <div className="text-xs font-semibold text-slate-500 text-center">Sen</div>
            <div className="text-xs font-semibold text-slate-500 text-center">Sel</div>
            <div className="text-xs font-semibold text-slate-500 text-center">Rab</div>
            <div className="text-xs font-semibold text-slate-500 text-center">Kam</div>
            <div className="text-xs font-semibold text-slate-500 text-center">Jum</div>
            <div className="text-xs font-semibold text-slate-500 text-center">Sab</div>
            <div className="text-xs font-semibold text-slate-500 text-center">Min</div>
        </>
    );
}

interface CalendarProps {
    onCell?: (date: string, days: number) => ReactNode | undefined;
    onDateChange: (date: DateTime<true>) => void;
}

function Calendar({ onDateChange, onCell }: CalendarProps) {
    const [currentMonth, setCurrentDate] = useState(DateTime.now());

    const openPrevMonth = () => {
        setCurrentDate(currentMonth.minus({ month: 1 }));
    }

    const openNextMonth = () => {
        setCurrentDate(currentMonth.plus({ month: 1 }));
    }

    const baseCalendarInformation = useMemo(() => {
        // const previousMonth = currentMonth.minus({ month: 1 });
        // const nextMonth = currentMonth.plus({ month: 1 });

        const fullTableRows = Array.from({ length: 42 }, (_, index) => index + 1);

        return {
            today: DateTime.now().toFormat('yyyy-MM-dd'),
            startMainTable: currentMonth.weekday,
            maxDay: currentMonth.daysInMonth!,
            fullTableRows
        }
    }, [currentMonth]);

    // Listen to date change
    useEffect(() => {
        onDateChange && onDateChange(currentMonth);
    }, [currentMonth]);

    return (
        <div className="border bg-white p-4 rounded-xl">
            <div className="flex justify-between items-center pb-8">
                <div className="hover:cursor-pointer" onClick={openPrevMonth}>
                    <IoIosArrowBack />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <h2>{currentMonth.monthLong}</h2>
                    <span className="font-semibold text-sm">{currentMonth.year}</span>
                </div>
                <div className="hover:cursor-pointer" onClick={openNextMonth}>
                    <IoIosArrowForward />
                </div>
            </div>
            <div className="grid grid-cols-7 items-center">
                {/* HEADER */}
                <CalendarHeader />

                {
                    (() => {
                        let currentDays = 0;

                        return baseCalendarInformation.fullTableRows.map((row) => {
                            const activeDate = DateTime.fromFormat(`${currentMonth.toFormat('yyyy-MM')}-${currentDays+1}`, 'yyyy-MM-d').toFormat('yyyy-MM-dd');

                            return (
                                <div className={`flex items-center gap-1 justify-center p-2 text-sm rounded ${baseCalendarInformation.today === activeDate ? 'bg-slate-100' : ''} hover:bg-slate-200`}>
                                    {(() => {

                                        if (row < baseCalendarInformation.startMainTable-1
                                            || currentDays+1 > baseCalendarInformation.maxDay) {
                                            return null;
                                        }

                                        currentDays++;

                                        const renderRow = onCell
                                            ? onCell(
                                                activeDate,
                                                currentDays
                                            )
                                            : <div className="flex flex-col items-center">
                                                <span className="text-sm md:text-base">{currentDays}</span>
                                            </div>;

                                        return renderRow;
                                    })()}
                                </div>
                            );
                        })
                    })()
                }
            </div>
        </div>
    );
}

export default Calendar;