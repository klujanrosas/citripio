import sha256 from 'crypto-js/sha256';
import { getUTCDate } from './utils';

export class LogEntry {
  constructor({ prevHash, message, timestamp }) {
    this.prevHash = prevHash;
    this.message = message;
    this.timestamp = timestamp;

    this.nonce = 0;
    this.hash = this.computeHash();
  }

  computeHash() {
    const hash = sha256(
      this.prevHash + this.timestamp + this.message + this.nonce
    );

    return hash.toString();
  }

  toString() {
    return JSON.stringify({
      prevHash: this.prevHash,
      message: this.message,
      timestap: this.timestamp,
      hash: this.hash,
    });
  }
}

export class Log {
  constructor() {
    const initialEntry = new LogEntry({
      timestamp: getUTCDate(),
      message: "Hi there, I'm Kenneth",
      prevHash: '-',
    });

    this.entries = [initialEntry];
  }
  first() {
    return this.entries[0];
  }
  last() {
    return this.entries[this.entries.length - 1];
  }
  /**
   * @param {LogEntry} entry
   */
  write(entry) {
    entry.prevHash = this.last().hash;

    const expectedPrefix = '00';

    while (entry.hash.substring(0, 2) !== expectedPrefix) {
      entry.nonce += 1;
      entry.hash = entry.computeHash();
    }

    this.entries.push(entry);
  }
  // TODO: IoC this one so we can snapshot when test flushing
  flush() {
    let content = '';
    let currentEntries = this.entries;
    currentEntries.forEach((entry) => {
      content += `${entry.hash},${entry.message},${entry.nonce}\n`;
    });

    return content;
  }
}
