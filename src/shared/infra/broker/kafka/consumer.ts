import Kafka from "node-rdkafka";

const getConsumer = () => {
  return new Kafka.KafkaConsumer(
    {
      "group.id": "kafka",
      "metadata.broker.list": "localhost:9092",
    },
    {}
  );
};

export { getConsumer };
