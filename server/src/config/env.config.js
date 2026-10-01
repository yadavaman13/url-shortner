import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV == 'production';

if (!process.env.DATABASE_URL) {
    throw new Error('MISSING ENVIRONMENT VARIABLE: DATABASE_URL');
}

const envConfig = {
    //  Server configuration keys
    SERVER_PORT: process.env.SERVER_PORT || 3000,
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',
    IS_PRODUCTION: isProduction,
    DATABASE_URL: process.env.DATABASE_URL,
};

export default envConfig;
