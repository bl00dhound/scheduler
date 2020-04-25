const { expect } = require('chai');
const { times, omit, pluck, pipe, map } = require('lodash/fp');
const path = require('path');

const FileService = require('../src/services/file.service');
const { parseBooleanValue } = require('../src/utils/index');

const {
  ensureMDB,
  cleanup,
  createPatient,
  convertPatientsToDSV,
  writeLinesToFile,
  unlink,
  find,
} = require('./test.utils');

let db = null;
let patientsCollection = null;
let autoPatients = [];
let withoutFirstNamePatients = [];
let withoutEmailsButWithConsent = [];
let findPatients = null;

const DATA_FILE_PATH = path.resolve(__dirname, 'data/test-data.dsv');
const DIVIDER = '|';

describe('#Import File to MongoDB', () => {

  before(async () => {
    db = await ensureMDB();
    await cleanup(db);
    patientsCollection = db.collection('Patients');
    findPatients = find.bind(null, patientsCollection);
    autoPatients = times(createPatient, 15);
    withoutFirstNamePatients = times(() => createPatient({ firstName: '' }), 5);
    withoutEmailsButWithConsent = times(() => createPatient({
      consent: 'Y',
      email: '',
    }), 5);
    const result = [
      ...autoPatients,
      ...withoutFirstNamePatients,
      ...withoutEmailsButWithConsent
    ];
    const lines = result.map(patient => convertPatientsToDSV(patient, DIVIDER));
    await writeLinesToFile(DATA_FILE_PATH, lines);

    await FileService.import(patientsCollection, DATA_FILE_PATH, DIVIDER);
  });

  it('Check randomly generated data', () => {
    return findPatients({}, 15)
      .then(patients => {
        patients.forEach((patient, idx) => {
          expect(
            omit(['_id', 'dateOfBirth', 'consent'], patient)
          ).to.be.eql(
            omit(['dateOfBirth', 'consent'], autoPatients[idx])
          );
          expect(
            new Date(patient.dateOfBirth).toUTCString()
          ).to.be.equal(
            new Date(autoPatients[idx].dateOfBirth).toUTCString()
          );
          expect(patient.consent).to.be.equal(parseBooleanValue(autoPatients[idx].consent));
        });
      });
  });

  it('Check all patients where the first name is missing', () => {
    return findPatients({ firstName: '' })
      .then(patients => {
        expect(patients.length).to.be.equal(5);
        patients.forEach((patient, idx) => {
          expect(
            omit(['_id', 'dateOfBirth', 'consent'], patient)
          ).to.be.eql(
            omit(['dateOfBirth', 'consent'], withoutFirstNamePatients[idx])
          );
          expect(
            new Date(patient.dateOfBirth).toUTCString()
          ).to.be.equal(
            new Date(withoutFirstNamePatients[idx].dateOfBirth).toUTCString()
          );
          expect(patient.consent).to.be.equal(parseBooleanValue(withoutFirstNamePatients[idx].consent));
        });
      });
  });

  it('Check all patients where the email address is missing, but consent is Y', () => {
    return findPatients({ consent: true, email: '' })
      .then(patients => {
        expect(patients.length).to.be.equal(5);
        patients.forEach((patient, idx) => {
          expect(
            omit(['_id', 'dateOfBirth', 'consent'], patient)
          ).to.be.eql(
            omit(['dateOfBirth', 'consent'], withoutEmailsButWithConsent[idx])
          );
          expect(
            new Date(patient.dateOfBirth).toUTCString()
          ).to.be.equal(
            new Date(withoutEmailsButWithConsent[idx].dateOfBirth).toUTCString()
          );
          expect(patient.consent).to.be.equal(parseBooleanValue(withoutEmailsButWithConsent[idx].consent));
        });
      });
  });


  after(async () => {
    await unlink(DATA_FILE_PATH);
    await cleanup(db);
  });

});
