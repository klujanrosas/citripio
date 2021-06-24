import fs from 'fs'

let ID = null;

export function startProcessing({ logInstance, app }) {
  ID = setInterval(() => {
    writeEntries({
      content: logInstance.flush(),
      onFinish() {
        app.log.info('Wrote to file on disk.')
      },
      onError(err) {
        app.log.error(err)
      }
    })
  }, 5000);
}

export function stopProcessing() {
  clearInterval(ID)
}

export function writeEntries({ content, onFinish, onError }) {
  const stream = fs.createWriteStream("./log-entries.csv", {
    // flags: 'a'
    autoClose: true
  })
  
  stream.write(content, 'utf-8', (err) => {
    if (err) {
      onError(err)
      return
    }

    onFinish()
  })
}