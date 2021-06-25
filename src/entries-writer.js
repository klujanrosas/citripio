import fs from 'fs';
import { getConfig } from './config';

let ID = null;

const defaultProcessingOptions = {
  writer: { write: writeEntries },
};
export function startProcessing(processingOptions) {
  const {
    logInstance,
    app,
    writer = { write: writeEntries },
  } = {
    ...defaultProcessingOptions,
    ...processingOptions,
  };

  ID = setInterval(() => {
    writer.write({
      content: logInstance.flush(),
      onFinish() {
        app.log.info('Wrote to file on disk.');
      },
      onError(err) {
        app.log.error(err);
      },
    });
  }, 5000);
}

export function stopProcessing() {
  clearInterval(ID);
}

export function writeEntries({ content, onFinish, onError }) {
  const stream = fs.createWriteStream(getConfig().FILENAME, {
    autoClose: true,
  });

  stream.write(content, 'utf-8', (err) => {
    if (err) {
      onError(err);
      return;
    }

    onFinish();
  });
}
