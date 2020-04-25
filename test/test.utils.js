require('dotenv').config();
const { MongoClient } = require('mongodb');
const faker = require('faker');
const { promisify } = require('util');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const log = require('../src/utils/logger');
const FieldTypes = require('../src/enum/field-types.enum');
const config = require('../src/config');
const patientFields = require('../src/utils/patiens-fields');

const ensureMDB = () => MongoClient.connect(config.mongoUri, { useUnifiedTopology: true })
  .then(client => client.db(`${config.mongoDbName}_test`))
  .catch(log.error);

const cleanup = async db => {
  const collections = await db.collections();
  const promises = collections.map(coll => coll.deleteMany({}));
  await Promise.all(promises);
};

const _createFakePatientReducer = (acc, field, idx) => {
  const { name, type } = patientFields[idx];
  switch (type) {
    case FieldTypes.DATE: {
      return { ...acc, [name]: faker.date.past().toLocaleDateString('en-US') };
    }
    case FieldTypes.BOOLEAN: {
      return { ...acc, [name]: faker.random.boolean() ? 'Y' : 'N' };
    }
    default:
      return { ...acc, [name]: faker.lorem.words() };
  }
};

const createPatient = (additionalFields = {}) => {
  const patient = patientFields.reduce(_createFakePatientReducer, {});
  return { ...patient, ...additionalFields };
};

const convertPatientsToDSV = (patient, delimiter = '|') => patientFields.map(({ name }) => patient[name]).join(delimiter);

const writeLinesToFile = (filePath, lines) => writeFile(filePath, lines.join('\n'), 'utf8');

const find = async (collection, query, limit = 10, sort = { _id: 1 }) => collection
  .find(query)
  .limit(limit)
  .sort(sort)
  .toArray();

module.exports = {
  ensureMDB,
  cleanup,
  createPatient,
  convertPatientsToDSV,
  writeLinesToFile,
  unlink,
  find,
};
