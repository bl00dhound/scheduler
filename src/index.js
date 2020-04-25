const path = require('path');

const config = require('./config');
const log = require('./utils/logger');
const FileService = require('./services/file.service');

const main = async client => {
  const pathToFile = path.resolve(__dirname, '..', process.argv[2]);
  const divider = process.argv[3];
  const patients = await client.db(config.mongoDbName).collection('Patients');

  if (!pathToFile) throw new Error(`"${pathToFile}" is not correct argument for path to file.`);

  await FileService.import(patients, pathToFile, divider);
  log.info('File is imported successfully!');
};

module.exports = main;
