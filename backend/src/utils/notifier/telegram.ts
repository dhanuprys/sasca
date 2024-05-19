import axios from "axios";

const sendTelegramMessage = async (chatId: string, text: string) => {
    const TOKEN = process.env.TELEGRAM_TOKEN;

    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: text
        });
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export default sendTelegramMessage;