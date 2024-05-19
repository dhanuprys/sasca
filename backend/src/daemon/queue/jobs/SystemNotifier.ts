import Queue from "bull";
import createJob from "../../../utils/createJob";
import sendTelegramMessage from "../../../utils/notifier/telegram";

export interface SystemNotifierData {
    message: string;
}

const processor: Queue.ProcessCallbackFunction<any> = async (
    job: Queue.Job<SystemNotifierData>,
    done: Queue.DoneCallback
) => {
    const { message } = job.data;

    sendTelegramMessage(
        process.env.TELEGRAM_SYSTEM_NOTIFIER_CHAT_ID!,
        message
    );

    done();
}

export default createJob<SystemNotifierData>(
    'system-notifier',
    processor
);