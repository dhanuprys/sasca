import useBottomModalStore from "@/context/useBottomModal";
import axios from "axios";
import { useState } from "react";

interface ScheduleCreationProps {
    dates: string[];
}

function ScheduleCreation({ dates }: ScheduleCreationProps) {
    const [isHoliday, setIsHoliday] = useState(false);
    const [holidayReason, setHolidayReason] = useState('');
    const [inStartTime, setInStartTime] = useState('06:00');
    const [inEndTime, setInEndtime] = useState('07:00');
    const [outStartTime, setOutStartTime] = useState('15:25');
    const [outEndTime, setOutEndtime] = useState('16:00');

    const { closeAndClear } = useBottomModalStore();

    const storeSchedule = () => {
        axios.post(
            '/api/v1/schedule',
            {
                policy: {
                    is_holiday: isHoliday,
                    holiday_reason: holidayReason,
                    checkin_start_time: inStartTime,
                    checkin_end_time: inEndTime,
                    checkout_start_time: outStartTime,
                    checkout_end_time: outEndTime
                },
                dates
            }
        ).then(() => {
            window.location.href = window.location.href;
            // closeAndClear();

        }).catch(() => {
            console.log('error');
        });
    };

    return (
        <div>
            <div>Ada {dates.length} tanggal yang dipilih</div>
            <div className="mt-10 flex flex-col gap-4">
                <div className="flex gap-2">
                    <input id="is_holiday" onChange={(e) => setIsHoliday(e.target.checked)} type="checkbox" />
                    <label htmlFor="is_holiday">Libur</label>
                </div>

                {
                    isHoliday
                        ? <>
                            <div>
                                <h3 className="py-2 font-semibold">Alasan</h3>
                                <div>
                                    <input onChange={(e) => setHolidayReason(e.target.value)} className="w-full px-4 py-2 rounded-xl border" type="text" />
                                </div>
                            </div>
                        </>
                        : <>
                            <div>
                                <h3 className="py-2 font-semibold">Jam Masuk</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <input onChange={(e) => setInStartTime(e.target.value)} defaultValue={inStartTime} className="px-4 py-2 rounded-xl border" type="time" />
                                    <input onChange={(e) => setInEndtime(e.target.value)} defaultValue={inEndTime} className="px-4 py-2 rounded-xl border" type="time" />
                                </div>
                            </div>

                            <div>
                                <h3 className="py-2 font-semibold">Jam Pulang</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <input onChange={(e) => setOutStartTime(e.target.value)} defaultValue={outStartTime} className="px-4 py-2 rounded-xl border" type="time" />
                                    <input onChange={(e) => setOutEndtime(e.target.value)} defaultValue={outEndTime} className="px-4 py-2 rounded-xl border" type="time" />
                                </div>
                            </div>
                        </>
                }

                <div>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-400" onClick={storeSchedule}>Simpan</button>
                </div>
            </div>
        </div>
    );
}

export default ScheduleCreation;