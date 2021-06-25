import { jest } from '@jest/globals';
import { startProcessing, stopProcessing } from './entries-writer';
import { Log } from './models';
import path from 'path';
import asyncFs from 'fs/promises';
import fs from 'fs';

async function checkFileExists({ path }) {
  return new Promise(async (resolve, reject) => {
    const exists = await asyncFs.access(path, fs.constants.F_OK);
    if (!exists) {
      return reject({ error: 'File does not exist.' });
    }

    return resolve(exist);
  });
}

test('writes to disk every 5 seconds', async () => {
  const info = jest.fn();
  const error = jest.fn();
  const mockWriter = {
    write: jest.fn(),
  };

  jest.useFakeTimers('modern');

  const log = new Log();
  const id = startProcessing({
    app: { log: { info, error } },
    logInstance: log,
    writer: mockWriter,
  });

  expect(mockWriter.write).toHaveBeenCalledTimes(0);
  expect(checkFileExists({ path: './log-entries.csv' })).rejects.toEqual({
    error: 'File does not exist.',
  });

  jest.advanceTimersByTime(5000);
  expect(mockWriter.write).toHaveBeenCalledTimes(1);

  jest.advanceTimersByTime(5000);
  expect(mockWriter.write).toHaveBeenCalledTimes(2);
});
