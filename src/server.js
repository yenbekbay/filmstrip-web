/* @flow */

import express from 'express';
import next from 'next';
import type { $Request, $Response } from 'express';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: 'app', dev });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();

  const server = express();

  server.get('*', (req: $Request, res: $Response) => handle(req, res));

  server.listen(3000, (err: ?Error) => {
    if (err) throw err;

    // eslint-disable-next-line no-console
    console.log('> Ready on http://localhost:3000');
  });
})();
