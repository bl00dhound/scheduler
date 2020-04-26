const { expect } = require('chai');
const _times = require('lodash/times');
const _omit = require('lodash/omit');
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
    autoPatients = _times(15, createPatient);
    withoutFirstNamePatients = _times(5, () => createPatient({ firstName: '' }));
    withoutEmailsButWithConsent = _times(5, () => createPatient({
      consent: 'Y',
      email: '',
    }));
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
            _omit(patient, ['_id', 'dateOfBirth', 'consent'])
          ).to.be.eql(
            _omit(autoPatients[idx], ['dateOfBirth', 'consent'])
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
            _omit(patient, ['_id', 'dateOfBirth', 'consent'])
          ).to.be.eql(
            _omit(withoutFirstNamePatients[idx], ['dateOfBirth', 'consent'])
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
            _omit(patient, ['_id', 'dateOfBirth', 'consent'])
          ).to.be.eql(
            _omit(withoutEmailsButWithConsent[idx], ['dateOfBirth', 'consent'])
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
