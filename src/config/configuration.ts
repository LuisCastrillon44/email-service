export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE,
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY,
  },
});
