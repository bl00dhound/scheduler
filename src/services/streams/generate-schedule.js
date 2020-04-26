const { Transform } = require('stream');

const NAME = 'Day';

/**
 * Stream for creating emails for users. I've implemented flexible solution that can be
 * used according to situation or easily updated if required.
 */

class GenerateSchedule extends Transform {
  constructor(options) {
    super(options);
    this._daysFromNow = 1;
  }

  _transform(patient, _enc, done) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + this._daysFromNow);

    const email = {
      name: `${NAME} ${this._daysFromNow}`,
      scheduledDate: targetDate,
      patientId: patient._id,
    };

    this.push(email);
    this._daysFromNow += 1;
    done();
  }
}

module.exports = GenerateSchedule;
