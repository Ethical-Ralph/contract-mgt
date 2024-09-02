import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().optional().allow(''),
  DB_NAME: Joi.string().required(),
});
