require('dotenv').config({ path: ['.env.local', '.env'] });

import cron from 'node-cron';
import { DateTime } from 'luxon';
import chalk from 'chalk';
import schedules from './kernel';

const now = DateTime.now();

console.log(chalk.blue(`Starting cronjob services at ${now.toFormat('yyyy-MM-dd HH:mm:ss')}`));

for (const schedule of schedules) {
    if (!cron.validate(schedule.schedule)) {
        console.log(chalk.red(`Invalid schedule expression ${schedule.schedule}`));
        continue;
    }

    console.log(chalk.blue(`Registering JOB`));
    console.log(chalk.blue('Name:'), schedule.name);
    console.log(chalk.blue('Desc:'));
    console.log(schedule.description);
    console.log(chalk.blue('Run expression:'), schedule.schedule);
    console.log();

    cron.schedule(
        schedule.schedule,
        // Execute wrapper
        async () => {
            console.log(chalk.blue('Starting job'), schedule.name);

            try {
                await schedule.executor();

                console.log(chalk.green('Job executed successfully'), schedule.name);
            } catch (error) {
                console.log(chalk.red('Job failure for'), schedule.name);
                console.log(chalk.red('Message:'));
                console.log(error ? (error as Error).message : '');
            }
        }
    );
}