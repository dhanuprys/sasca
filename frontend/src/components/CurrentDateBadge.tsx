import { DateTime } from "luxon";
import { useMemo } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";

function CurrentDateBadge() {
    const currentDate = useMemo(() => DateTime.now().setLocale('id').toFormat('dd LLL yyyy'), []);

    return (
        <div className="flex items-center gap-1 [&>*]:!text-xs">
            <IoCalendarClearOutline className="text-sky-800" />
            <span className="font-semibold">{currentDate}</span>
        </div>
    );
}

export default CurrentDateBadge;