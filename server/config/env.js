const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000').transform(val => parseInt(val, 10)),
    MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
    JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters long'),
    JWT_REFRESH_SECRET: z.string().min(10).default('uniconnect_refresh_jwt_secret_production_key_2026'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Environment configuration validation failed:');
    console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
    process.exit(1);
}

module.exports = parsedEnv.data;
