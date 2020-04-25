const { Transform } = require('stream');

class BreakLines extends Transform {
  _transform(line, _enc, done) {
    let data = line.toString();
    if (this._lastLineData) data = this._lastLineData + data;

    const lines = data.split('\n');
    [this._lastLineData] = lines.splice(lines.length - 1, 1);

    lines.forEach(this.push.bind(this));
    done();
  }

  _flush(done) {
    if (this._lastLineData) this.push(this._lastLineData);
    this._lastLineData = null;
    done();
  }
}

module.exports = BreakLines;
