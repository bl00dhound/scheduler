const { Transform } = require('stream');

const FieldTypes = require('../../enum/field-types.enum');
const patientsFields = require('../../utils/patient-fields');
const { parseBooleanValue, parseDataValue } = require('../../utils');

/**
 * Function that transforms line to patients object. I use "patientsFields" array for
 * defining fields and their types. Almost all of the fields are strings but I decided to
 * convert Y/N to true/false and write birthday as a Date object.
 */

const _createPatientReducer = (acc, value, idx) => {
  const { name, type } = patientsFields[idx];
  switch (type) {
    case FieldTypes.DATE: {
      return { ...acc, [name]: parseDataValue(value) };
    }
    case FieldTypes.BOOLEAN: {
      return { ...acc, [name]: parseBooleanValue(value) };
    }
    default:
      return { ...acc, [name]: value };
  }
};

// simple transform stream that prepares data for mongoDB inserting
class ParseLines extends Transform {
  constructor(options, divider) {
    super(options);
    this.divider = divider || '|';
  }

  _transform(line, _enc, done) {
    const data = line.split(this.divider).reduce(_createPatientReducer, {});

    this.push(data);
    done();
  }
}

module.exports = ParseLines;
