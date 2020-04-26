const { expect } = require('chai');
const _times = require('lodash/times');
const _omit = require('lodash/omit');
const _intersection = require('lodash/intersection');
const path = require('path');

const FileService = require('../src/services/file.service');
const EmailService = require('../src/services/email.service');
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
let emailsCollection = null;
let autoPatients = [];
let withoutFirstNamePatients = [];
let withoutEmailsButWithConsent = [];
let targetPatients = [];
let findPatients = null;
let findEmails = null;

const DATA_FILE_PATH = path.resolve(__dirname, 'data/test-data.dsv');
const DIVIDER = '|';

describe('#Scheduler', () => {

  before(async () => {
    db = await ensureMDB();
    await cleanup(db);
    patientsCollection = db.collection('Patients');
    emailsCollection = db.collection('Emails');
    findPatients = find.bind(null, patientsCollection);
    findEmails = find.bind(null, emailsCollection);
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

  describe('Import file to MongoDB', () => {

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

  });

  describe('Schedule emails for patients', () => {

    before('Find users that must get emails', async () => {
      targetPatients = autoPatients.filter(patient => patient.consent);
      await EmailService.createSchedule(emailsCollection, patientsCollection);
      createdEmails = await findEmails({}, 100);
      targetPatients = await findPatients({ consent: true, email: { $ne: '' } }, 100);
    });

    it('Check is email was created in Emails-collection for patients with consent Y', () => {
      expect(createdEmails.length).to.be.equal(targetPatients.length);
      const emailPatientIds = createdEmails.map(email => email.patientId.toString());
      const patientIds = targetPatients.map(patient => patient._id.toString());
      const intersected = _intersection(emailPatientIds, patientIds);
      expect(intersected.length).to.be.equal(patientIds.length);
    });

    it('Check is all emails has 1 day period and were created for different patients', () => {
      let dayCounter = 1;
      const patientIds = new Set();
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);
      createdEmails.forEach(email => {
        const emailDate = email.scheduledDate.getDate();
        expect(emailDate).to.be.equal(targetDate.getDate());
        expect(email.name).to.be.equal(`Day ${dayCounter++}`);
        targetDate.setDate(targetDate.getDate() + 1);
        patientIds.add(email.patientId.toString());
      });
      expect(patientIds.size).to.be.equal(createdEmails.length);
    });

  });

  after(async () => {
    await unlink(DATA_FILE_PATH);
    await cleanup(db);
  });

});
