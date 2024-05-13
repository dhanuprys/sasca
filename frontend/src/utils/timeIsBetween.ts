import { DateTime } from "luxon";

function timeIsBetween(comparison: [string, string], compareTime?: string) {
    compareTime = compareTime || DateTime.now().toFormat('HH:mm:ss');

    return compareTime > comparison[0] && compareTime < comparison[1];
}

export default timeIsBetween;