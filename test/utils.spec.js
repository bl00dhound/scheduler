const { expect } = require('chai');
const { parseBooleanValue } = require('../src/utils');

describe('#Utils', () => {

  describe('Parsers', () => {

    it('"false" -> false', () => {
      expect(parseBooleanValue('false')).to.be.equal(false);
    });
    it('"true" -> true', () => {
      expect(parseBooleanValue('true')).to.be.equal(true);
    });
    it('"Y" -> true', () => {
      expect(parseBooleanValue('Y')).to.be.equal(true);
    });
    it('"y" -> true', () => {
      expect(parseBooleanValue('y')).to.be.equal(true);
    });
    it('"N" -> false', () => {
      expect(parseBooleanValue('N')).to.be.equal(false);
    });
    it('"n" -> false', () => {
      expect(parseBooleanValue('n')).to.be.equal(false);
    });
    it('false -> false', () => {
      expect(parseBooleanValue(false)).to.be.equal(false);
    });
    it('true -> true', () => {
      expect(parseBooleanValue(true)).to.be.equal(true);
    });
    it('"Yes" -> true', () => {
      expect(parseBooleanValue('Yes')).to.be.equal(true);
    });
    it('"yeS" -> true', () => {
      expect(parseBooleanValue('yeS')).to.be.equal(true);
    });
    it('"No" -> false', () => {
      expect(parseBooleanValue('No')).to.be.equal(false);
    });
    it('"nO" -> false', () => {
      expect(parseBooleanValue('nO')).to.be.equal(false);
    });
    it('undefined -> false', () => {
      expect(parseBooleanValue()).to.be.equal(false);
    });
    it('null -> false', () => {
      expect(parseBooleanValue(null)).to.be.equal(false);
    });
    it('"" -> false', () => {
      expect(parseBooleanValue('')).to.be.equal(false);
    });
    it('"asdf" -> false', () => {
      expect(parseBooleanValue('asdf')).to.be.equal(false);
    });
    it('NaN-> false', () => {
      expect(parseBooleanValue(NaN)).to.be.equal(false);
    });
    it('0 -> false', () => {
      expect(parseBooleanValue(0)).to.be.equal(false);
    });
    it('1 -> true', () => {
      expect(parseBooleanValue(1)).to.be.equal(true);
    });

  });

});