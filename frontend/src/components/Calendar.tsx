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
    onCell?: (date: string, dateInfo: { days: number; position: 'prev' | 'current' | 'next' }) => ReactNode | undefined;
    onCellClick?: (date: string) => void;
    onDateChange: (date: DateTime<true>) => void;
}

function Calendar({ onDateChange, onCell, onCellClick }: CalendarProps) {
    const [currentMonth, setCurrentDate] = useState(DateTime.now().set({ day: 1 }));

    const openPrevMonth = () => {
        setCurrentDate(currentMonth.minus({ month: 1 }));
    }

    const openNextMonth = () => {
        setCurrentDate(currentMonth.plus({ month: 1 }));
    }

    const baseCalendarInformation = useMemo(() => {
        const previousMonth = currentMonth.minus({ month: 1 });
        // const nextMonth = currentMonth.plus({ month: 1 });

        const fullTableRows = Array.from({ length: 42 }, (_, index) => index + 1);

        return {
            prevStartDay: previousMonth.daysInMonth - currentMonth.weekday + 1,
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
                    <h2 className="text-lg">{currentMonth.monthLong}</h2>
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
                        let prevDays = baseCalendarInformation.prevStartDay;
                        let currentDays = 0;
                        let nextDays = 0;
                        let withPrev = false;

                        return baseCalendarInformation.fullTableRows.map((row) => {
                            const activeDate = DateTime.fromFormat(`${currentMonth.toFormat('yyyy-MM')}-${currentDays + 1}`, 'yyyy-MM-d');
                            const activeDateFormat = activeDate.toFormat('yyyy-MM-dd');

                            return (
                                <div onClick={() => onCellClick && activeDate.isValid  && onCellClick(activeDateFormat)} className={`flex items-center gap-1 justify-center p-2 text-sm rounded ${baseCalendarInformation.today === activeDateFormat ? 'bg-slate-100' : ''} hover:bg-slate-200`}>
                                    {(() => {
                                        let output = 0;
                                        let position: 'prev' | 'current' | 'next' = 'current';

                                        if (row < baseCalendarInformation.startMainTable) {
                                            position = 'prev';
                                            output = ++prevDays;
                                            withPrev = true;
                                        } else if (currentDays >= baseCalendarInformation.maxDay) {
                                            position = 'next';
                                            output = ++nextDays;
                                        } else {
                                            output = ++currentDays;
                                        }

                                        const renderRow = onCell
                                            ? onCell(
                                                activeDateFormat,
                                                {
                                                    days: output,
                                                    position
                                                }
                                            )
                                            : <div className="flex flex-col items-center">
                                                <span className="md:text-base">{output}</span>
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