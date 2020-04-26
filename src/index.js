const { program } = require('commander');
const path = require('path');

const config = require('./config');
const log = require('./utils/logger');
const FileService = require('./services/file.service');
const EmailService = require('./services/email.service');

const _resolvePath = (value, prev) => {
  if (value) return path.resolve(__dirname, '..', value);
  return prev;
};

/**
 * This is an entry point to the project. I parse arguments, check them and call
 * services that I need. This logic can be extended with other services in the future
 * by adding new arguments and checks.
 */

program
  .option('-i, --import-file', 'import file with patients to database', false)
  .option('-s, --schedule-emails', 'import file with patients to database', false)
  .option('-d, --delimiter', 'path to file', '|')
  .option('-p, --file-path <value>', 'path to file', _resolvePath);

const main = async client => {
  program.parse(process.argv);
  const {
    filePath, importFile, scheduleEmails, delimiter,
  } = program;

  if (!filePath && importFile) throw new Error(`"${filePath}" is not correct argument for path to file.`);

  const db = await client.db(config.mongoDbName);
  const patients = db.collection('Patients');
  const emails = db.collection('Emails');

  if (importFile) {
    await FileService.import(patients, filePath, delimiter);
    log.info('File was imported and parsed successfully!');
  }

  if (scheduleEmails) {
    await EmailService.createSchedule(emails, patients);
    log.info('Schedule was created successfully!');
  }
};

module.exports = main;
