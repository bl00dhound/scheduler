const StreamService = require('./stream.service');
const { pipeline } = require('../utils/index');

const allConsentedQuery = { consent: true, email: { $ne: '' } };

/**
 * This service generates emails for patients that have their consent marked as "Y".
 * I implemented this logic through nodejs stream API, which is a simple and clear
 * solution.
 */

const service = {
  createSchedule: (emailCollection, patientCollection) => {
    const patients = patientCollection.find(allConsentedQuery).stream();
    const generateSchedule = StreamService.generateSchedule();
    const writeToMongo = StreamService.writeToMongo(emailCollection);

    return pipeline(patients, generateSchedule, writeToMongo);
  },
};

module.exports = service;
