const path = require('path');

const config = require('./config');
const log = require('./utils/logger');
const FileService = require('./services/file.service');
const EmailService = require('./services/email.service');

const main = async client => {
  const pathToFile = path.resolve(__dirname, '..', process.argv[2]);

  if (!pathToFile) throw new Error(`"${pathToFile}" is not correct argument for path to file.`);

  const divider = process.argv[3];
  const db = await client.db(config.mongoDbName);
  const patients = db.collection('Patients');
  const emails = db.collection('Emails');

  await FileService.import(patients, pathToFile, divider);
  log.info('File was imported and parsed successfully!');

  await EmailService.createSchedule(emails, patients);
  log.info('Schedule was created successfully!');
};

module.exports = main;
