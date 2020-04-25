const { Writable } = require('stream');

const BATCH_SIZE = 100;

class MongoWriter extends Writable {
  constructor(options, patients) {
    super(options);
    this.patients = patients;
    this._queue = [];
    this._batchLimit = BATCH_SIZE;
  }

  _write(data, _enc, done) {
    this._queue.push(data);
    if (this._queue.length === this._batchLimit) {
      this.patients.insertMany(this._queue, (err, result) => {
        if (err) throw err;
        this._queue = [];
        this.counter += result.insertedCount;
        done();
      });
    } else {
      done();
    }
  }

  _final(done) {
    if (this._queue.length) {
      this.patients.insertMany(this._queue, (err, result) => {
        if (err) throw err;
        this._queue = [];
        this.counter += result.insertedCount;
        done();
      });
    } else {
      done();
    }
  }
}

module.exports = MongoWriter;
