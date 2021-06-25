import fetch from 'node-fetch';
import spawn from 'cross-spawn';
import treeKill from 'tree-kill';
import getPort from 'get-port';
import pkgDir from 'pkg-dir';

const root = pkgDir.sync();

export function findPort() {
  return getPort();
}

export async function launchApp(dir, port) {
  return new Promise(async (resolve, reject) => {
    const instance = await spawn(process.execPath, ['-r', 'esm', dir], {
      env: {
        PORT: port,
        TIMESTAMP: false,
      },
      cwd: root,
    });
    let didResolve = false;
    function handleStdOut(data) {
      const message = data.toString();
      if (/listening on/i.test(message)) {
        didResolve = true;
        resolve(instance);
      }
      process.stdout.write(message);
    }

    function handleStdErr(data) {
      const message = data.toString();
      process.stderr.write(message);
    }

    instance.stdout.on('data', handleStdOut);
    instance.stdout.on('data', handleStdErr);

    instance.on('close', () => {
      instance.stdout.off('data', handleStdOut);
      instance.stderr.off('data', handleStdErr);
      if (!didResolve) {
        didResolve = true;
        resolve(instance);
      }
    });

    instance.on('error', (err) => {
      reject(err);
    });

    return instance;
  });
}

export async function killApp(instance) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return new Promise((resolve, reject) => {
    treeKill(instance.pid, (err) => {
      if (!err) {
        resolve();
      }
    });
  });
}

export async function httpFetch({ port, path, ...fetchConfig }) {
  const url = `http://localhost:${port}${path}`;

  let response = await fetch(url, fetchConfig);

  return response.json();
}
