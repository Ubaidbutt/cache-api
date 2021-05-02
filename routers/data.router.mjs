'use strict';

import express from 'express';
const dataRouter = express.Router();

dataRouter.route('/keys')
    .get()
    .post()
    .put()
    .delete()

dataRouter.route('/keys/:key')
    .get()
    .post()
    .put()
    .delete()

export default dataRouter;