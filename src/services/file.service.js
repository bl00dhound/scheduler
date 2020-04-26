const fs = require('fs');

const StreamService = require('./stream.service');
const { pipeline } = require('../utils/index');

/**
 * Service for reading, parsing and writing files to database. Main idea of this solution -
 * read buffer and transform data on the fly.
 * 1. fileSource creates readable stream from file.
 * 2. breakLines breaks buffer to lines.
 * 3. parseLines converts lines to patient-object, checks and converts fields if needed.
 * 4. writeToMongo writes transformed objects to mongoDB.
 */
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
