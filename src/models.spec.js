import * as models from './models';
import { getUTCDate } from './utils';

function writeTestEntry(logInstance, message) {
  logInstance.write(
    new models.LogEntry({
      prevHash: logInstance.last().hash,
      message,
      timestamp: getUTCDate(),
    })
  );
}

test('Log is initialized with a default entry', () => {
  const Log = new models.Log();

  expect(Log.entries).toHaveLength(1);
});

test('any LogEntry hash always starts with 2 zeros', () => {
  const Log = new models.Log();

  for (let i = 1; i <= 2000; i += 1) {
    writeTestEntry(Log, `Test Mesage #${i}`);
    expect(Log.entries[i].hash).toMatch(/^00.*/gi);
  }

  expect(Log.flush()).toMatchSnapshot();
});
