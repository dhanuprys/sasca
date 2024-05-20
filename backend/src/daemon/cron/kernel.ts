import { CronJobItem } from "../../blueprint";
import autoAlpha from "./executors/autoAlpha";
import makeRank from "./executors/makeRank";

const schedules: CronJobItem[] = [
    {
        name: 'Attendance checking system',
        description: 'Check and give alpha in missing row',
        executor: autoAlpha,
        schedule: '45 20 * * *'
    },
    {
        name: 'Daily Student Ranking',
        description: 'Fetch ranking for student',
        executor: makeRank,
        schedule: '0 19 * * *'
    }
];

export default schedules;