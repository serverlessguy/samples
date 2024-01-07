const { IoTDataPlaneClient, PublishCommand } = require('@aws-sdk/client-iot-data-plane');

// Declare environment variables
const awsRegion = process.env.AWS_REGION;
const responseTopic = process.env.RESPONSE_TOPIC;
console.log('AWS_REGION:', awsRegion);
console.log('RESPONSE_TOPIC:', responseTopic);

// Initialize the AWS SDK IoT Data Plane client
const iotDataClient = new IoTDataPlaneClient({ region: awsRegion });

exports.handler = async (event) => {
    // Print the incoming event to the log
    console.log('Received event:', JSON.stringify(event));

    // Extract the topic and message from the incoming event
    const incomingTopic = event.topic;
    const incomingMessage = event.message;

    // Process the incoming message (this is where your custom logic would go)

    // Define the response message
    const responseMessage = { message: incomingMessage, response: 'Message received on topic ' + incomingTopic };

    // Create parameters for the publish command
    const params = {
        topic: responseTopic,
        qos: 1,
        payload: JSON.stringify(responseMessage)
    };

    // Publish the response message to the MQTT topic
    try {
        await iotDataClient.send(new PublishCommand(params));
        console.log('Message published to topic:', responseTopic);
        return {
            statusCode: 200,
            body: JSON.stringify('Response sent to ' + responseTopic)
        };
    } catch (error) {
        console.error('Error publishing message:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error occurred')
        };
    }
};