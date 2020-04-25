const parseBooleanValue = value => {
  const YES = ['yes', 'y', 'true'];

  if (!value) return false;
  if (Number.isFinite(value)) return true;
  if (YES.includes(value.toString().toLowerCase())) return true;

  return false;
};

const parseDataValue = value => {
  if (!value) return null;
  return new Date(value);
};

module.exports = {
  parseBooleanValue,
  parseDataValue,
};
