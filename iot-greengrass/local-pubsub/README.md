## Publish and subscribe IoT Core messages

This template serves as an example for IoT Core communication for Greengrass components.

In this example, the component uses the IoT Core pubsub APIs offered by AWS IoT SDK to send and received messages over topics. 

This `LocalPubSub` component, when deployed on to a core device, publishes and subscribes to the messages on the topic (/topic/{iot:thingName}). 

The topic value is configurable in the component recipe. If you want to update the topic, the `aws.greengrass.ipc.mqttproxy` policy under `accessControl` configuration must also be updated to allowlist necessary operations on that topic. 

If the component is successfully deployed, you should see in the component logs (/greengrass/v2/logs/com.example.LocalPubSub) whenever a message is  published to the topic. 

Refer to the AWS IoT Greengrass [public documentation](https://docs.aws.amazon.com/greengrass/v2/developerguide/ipc-iot-core-mqtt.html) for more information on Greengrass iotcore communication.