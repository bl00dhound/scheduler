const FieldTypes = require('../enum/field-types.enum');

module.exports = [
  {
    name: 'programIdentifier',
    type: FieldTypes.STRING,
  },
  {
    name: 'dataSource',
    type: FieldTypes.STRING,
  },
  {
    name: 'cardNumber',
    type: FieldTypes.STRING,
  },
  {
    name: 'memberID',
    type: FieldTypes.STRING,
  },
  {
    name: 'firstName',
    type: FieldTypes.STRING,
  },
  {
    name: 'lastName',
    type: FieldTypes.STRING,
  },
  {
    name: 'dateOfBirth',
    type: FieldTypes.DATE,
  },
  {
    name: 'address1',
    type: FieldTypes.STRING,
  },
  {
    name: 'address2',
    type: FieldTypes.STRING,
  },
  {
    name: 'city',
    type: FieldTypes.STRING,
  },
  {
    name: 'state',
    type: FieldTypes.STRING,
  },
  {
    name: 'zipCode',
    type: FieldTypes.STRING,
  },
  {
    name: 'phone',
    type: FieldTypes.STRING,
  },
  {
    name: 'email',
    type: FieldTypes.STRING,
  },
  {
    name: 'consent',
    type: FieldTypes.BOOLEAN,
  },
  {
    name: 'mobilePhone',
    type: FieldTypes.STRING,
  },
];
