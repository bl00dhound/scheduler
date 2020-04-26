const fs = require('fs');

const StreamService = require('./stream.service');
const { pipeline } = require('../utils/index');

const service = {
  import: (patients, pathToFile, divider) => {
    const fileSource = fs.createReadStream(pathToFile);
    const breakLines = StreamService.breakLines();
    const parseLines = StreamService.parseLines(divider);
    const writeToMongo = StreamService.writeToMongo(patients);

    return pipeline(fileSource, breakLines, parseLines, writeToMongo);
  },
};

module.exports = service;
