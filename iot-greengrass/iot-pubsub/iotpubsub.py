import sys
import time
from concurrent.futures import TimeoutError
import awsiot.greengrasscoreipc
import awsiot.greengrasscoreipc.model as model

TIMEOUT = 10
ipc_client = awsiot.greengrasscoreipc.connect()

class StreamHandler(model.SubscribeToIoTCoreStreamHandler):
    def on_stream_event(self, event: model.IoTCoreMessage) -> None:
        try:
            # Access the payload of the message
            payload = event.message.payload
            # Decode payload bytes to a string
            message = payload.decode('utf-8')
            print(f'Received message: {message}')
            # Process and respond to the message
            updated_message = f"Updated: {message}"
            publish_to_topic(event.message.topic_name + "/response", updated_message)
        except Exception as e:
            print(f"Error processing the message: {e}")

    def on_stream_error(self, error: Exception) -> bool:
        print(f'Error with stream processing: {error}')
        # Return True to close stream, False to keep it open
        return False

    def on_stream_closed(self) -> None:
        print('Stream closed')

def subscribe_to_topic(topic):
    request = model.SubscribeToIoTCoreRequest()
    request.topic_name = topic
    request.qos = model.QOS.AT_LEAST_ONCE
    handler = StreamHandler()
    operation = ipc_client.new_subscribe_to_iot_core(handler)
    operation.activate(request)
    future_response = operation.get_response()
    try:
        future_response.result(TIMEOUT)
        print(f'Subscribed to topic: {topic}')
    except TimeoutError:
        print('Timeout occurred while subscribing to topic')

def publish_to_topic(topic, message):
    request = model.PublishToIoTCoreRequest()
    request.topic_name = topic
    request.payload = bytes(message, "utf-8")
    request.qos = model.QOS.AT_LEAST_ONCE
    operation = ipc_client.new_publish_to_iot_core()
    operation.activate(request)
    future_response = operation.get_response()
    try:
        future_response.result(TIMEOUT)
        print(f'Message published to topic: {topic}')
    except TimeoutError:
        print('Timeout occurred while publishing message')

if __name__ == "__main__":
    # Get the topic from the Run command arguments
    topic = sys.argv[1]

    subscribe_to_topic(topic)

    # Keep the script running
    while True:
        # Prevents the script from exiting
        time.sleep(1)
