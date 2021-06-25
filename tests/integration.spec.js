import { findPort, httpFetch, killApp, launchApp } from './utils';

jest.setTimeout(20000);

test('lists all entries on log', async () => {
  const port = await findPort();
  const app = await launchApp('src/index', port);

  const res = await httpFetch({ port, path: '/', method: 'GET' });

  await killApp(app);

  expect(res).toHaveLength(1);
});

test('writes entries concurrently', async () => {
  const port = await findPort();
  const app = await launchApp('src/index', port);

  let requests = [];
  for (let i = 1; i < 1000; i += 1) {
    requests.push(
      httpFetch({
        port,
        path: '/citripio',
        method: 'post',
        body: JSON.stringify({ message: `writing entry #${i} from network` }),
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  await Promise.all(requests);

  const res = await httpFetch({ port, path: '/', method: 'get' });

  await killApp(app);

  expect(res).toHaveLength(1000);
});
