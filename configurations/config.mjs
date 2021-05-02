import dotenv from 'dotenv';

dotenv.config();

const config = {
    webPort: process.env.PORT || 8000,
    mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/cache',
    maxCacheLimit: process.env.MAX_CACHE_LIMIT || 3
};

export default config;