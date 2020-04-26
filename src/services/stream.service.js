const BreakLines = require('./streams/break-lines');
const ParseLines = require('./streams/parse-lines');
const MongoWriter = require('./streams/mongo-write');
const GenerateSchedule = require('./streams/generate-schedule');

/**
 * It is just a simple service that creates instances of streams and puts some data
 * to them if needed.
 */
const service = {
  parseLines: divider => new ParseLines({ objectMode: true }, divider),
  breakLines: () => new BreakLines({ objectMode: true }),
  writeToMongo: collection => new MongoWriter({ objectMode: true }, collection),
  generateSchedule: () => new GenerateSchedule({ objectMode: true }),
};

module.exports = service;
