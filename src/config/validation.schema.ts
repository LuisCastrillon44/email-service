import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  RABBITMQ_URL: Joi.string().required(),
  RABBITMQ_QUEUE: Joi.string().required(),
  BREVO_API_KEY: Joi.string().required(),
});
