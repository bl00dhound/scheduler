const StreamService = require('./stream.service');
const { pipeline } = require('../utils/index');

const allConsentedQuery = { consent: true, email: { $ne: '' } };

const service = {
  createSchedule: (emailCollection, patientCollection) => {
    const patients = patientCollection.find(allConsentedQuery).stream();
    const generateSchedule = StreamService.generateSchedule();
    const writeToMongo = StreamService.writeToMongo(emailCollection);

    return pipeline(patients, generateSchedule, writeToMongo);
  },
};

module.exports = service;
