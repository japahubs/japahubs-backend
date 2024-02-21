import Kafka from "node-rdkafka";

const getStream = (topic: string) => {
  return Kafka.Producer.createWriteStream(
    {
      "metadata.broker.list": "localhost:9092",
    },
    {},
    {
      topic: topic,
    }
  );
};

export { getStream };
