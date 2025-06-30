const amqp = require('amqplib');

const QUEUE_NAME = 'verify_user';

exports.enqueue = async (phoneNumber) => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ phoneNumber })), {
            persistent: true
        });

        console.log(`📩 Enqueued phone number: ${phoneNumber}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('❌ Error enqueuing:', error);
    }
};
