const fs = require('fs');
const { promisify } = require('util');
const stream = require('stream');

const StreamService = require('./stream.service');

const pipeline = promisify(stream.pipeline);

const service = {
  import: async (patients, pathToFile, divider) => {
    const fileSource = fs.createReadStream(pathToFile);
    const breakLines = StreamService.breakLines();
    const parseLines = StreamService.parseLines(divider);
    const writeToMongo = StreamService.writeToMongo(patients);

    return pipeline(fileSource, breakLines, parseLines, writeToMongo);
  },
};

module.exports = service;
