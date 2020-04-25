const config = {
  mongoUri: process.env.MONGO_URI,
  mongoDbName: process.env.MONGO_DB_NAME,
  logLevel: process.env.LOG_LEVEL || 'info',
  isDev: process.env.NODE_ENV === 'development',
};

module.exports = config;
