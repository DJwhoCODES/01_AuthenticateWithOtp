const amqp = require('amqplib');
const userService = require('./services/user.service');

const QUEUE_NAME = 'verify_user';

async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`📥 Waiting for messages in ${QUEUE_NAME}...`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const { phoneNumber } = JSON.parse(msg.content.toString());
                console.log(`🔧 Processing phone number: ${phoneNumber}`);

                try {
                    await userService.verifyUser(phoneNumber);
                    channel.ack(msg);
                } catch (err) {
                    console.error('❌ Error verifying user:', err);
                }
            }
        }, { noAck: false });
    } catch (error) {
        console.error('❌ Consumer error:', error);
    }
}

startConsumer();
