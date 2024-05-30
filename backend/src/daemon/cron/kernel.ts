import { CronJobItem } from "../../blueprint";
import autoAlpha from "./executors/autoAlpha";
import makeRank from "./executors/makeRank";
import scheduleBriefingNotifier from "./executors/scheduleBriefingNotifier";

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
    },
    {
        name: 'Daily Schedule Briefing',
        description: 'Send a notification to user',
        executor: scheduleBriefingNotifier,
        schedule: '55 5 * * *'
    }
];

export default schedules;