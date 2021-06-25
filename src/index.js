import fastify from 'fastify';

import * as routes from './routes';
import * as models from './models';
import * as entriesWriter from './entries-writer';
import { getConfig } from './config';

const config = getConfig();
const app = fastify({
  logger: true,
});

const logInstance = new models.Log();

routes.configure({ app, logInstance, models });

app.listen(config.PORT, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`server listening on ${address}`);

  entriesWriter.startProcessing({ logInstance, app });
});
