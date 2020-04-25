require('dotenv').config();
const { MongoClient } = require('mongodb');

const config = require('./src/config');
const main = require('./src');
const log = require('./src/utils/logger');

MongoClient.connect(config.mongoUri, { useUnifiedTopology: true })
  .then(client => main(client))
  .then(() => process.exit(0))
  .catch(err => {
    log.error(err);
    process.exit(1);
  });
