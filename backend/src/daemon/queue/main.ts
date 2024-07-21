require('dotenv').config({ path: ['.env.local', '.env'] });

import jobs from './kernel';
import chalk from 'chalk';

const SERVICE_MODE: string | undefined = process.env.SERVICE_MODE

if (
    SERVICE_MODE !== 'ALL'
    && SERVICE_MODE !== 'JOB'
) {
    console.error('Queue inactive');
    while (true) { /* SUSPEND PROCESS */ }
}

for (const job of jobs) {
    const { name, description, queue } = job;

    console.log(`Registering ${chalk.blue(name)} jobs`);
    console.log(`Desc: ${description}`);

    queue.instance.empty();

    queue.instance.process((job, done) => {
        try {
            queue.processor(job, done);
        } catch (error) {
            console.log(error);
        }
    });
    queue.instance.on('active', (job) => {
        console.log(`Job with ID: ${job.name}(${job.id}) is started`);
    });
    queue.instance.on('completed', (job) => {
        console.log(`Job with ID: ${job.name}(${job.id}) is completed`);
    });
    queue.instance.on('error', (error) => {
        console.log(error);
    });

    console.log();
}