const BreakLines = require('./streams/break-lines');
const ParseLines = require('./streams/parse-lines');
const MongoWriter = require('./streams/mongo-write');

const service = {
  parseLines: divider => new ParseLines({ objectMode: true }, divider),
  breakLines: () => new BreakLines({ objectMode: true }),
  writeToMongo: client => new MongoWriter({ objectMode: true }, client),
};

module.exports = service;
