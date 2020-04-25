const { Transform } = require('stream');

const FieldTypes = require('../../enum/field-types.enum');
const patientsFields = require('../../utils/patiens-fields');
const { parseBooleanValue, parseDataValue } = require('../../utils');

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
