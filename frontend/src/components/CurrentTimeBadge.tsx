import { swrFetcher } from "@/utils/swrFetcher";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { IoTimeOutline } from "react-icons/io5";
import useSWR from "swr";

function CurrentTimeBadge() {
    const { data: serverTime } = useSWR('/api/v1/datetime', swrFetcher);
    const [providerRefresh, setProviderRefresh] = useState(false);
    const [time, setTime] = useState(DateTime.now());

    useEffect(() => {
        if (providerRefresh && serverTime) {
            setProviderRefresh(true);
            setTime(DateTime.fromFormat(serverTime.time, 'HH:mm:ss') as DateTime<true>);
        }

        let timeInterval = setInterval(() => {
            setTime(time.plus({ second: 1 }));
        }, 1000);

        return () => clearInterval(timeInterval);
    }, [serverTime, providerRefresh, time]);

    useEffect(() => {
        let unlocker = setInterval(() => {
            setProviderRefresh(false);
        }, 5000);

        return () => clearInterval(unlocker);
    }, [providerRefresh]);

    return (
        <div className="flex items-center gap-1 [&>*]:!text-xs">
            <IoTimeOutline className="text-sky-800" />
            <span className="font-semibold">{time.toFormat('HH:mm:ss')}</span>
        </div>
    );
}

export default CurrentTimeBadge;