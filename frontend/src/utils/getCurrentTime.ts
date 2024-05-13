import { DateTime } from "luxon";

function getCurrentTime() {
    return DateTime.now().toFormat('HH:mm:ss');
}

export default getCurrentTime;