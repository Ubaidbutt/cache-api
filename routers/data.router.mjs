'use strict';

import express from 'express';
const dataRouter = express.Router();

import {
    getAllKeys, createData, removeAllKeys,
    deleteOneKey, getOneKey
} from '../controllers/data.controller.mjs';

dataRouter.post('/', createData);

dataRouter.route('/keys')
    .get(getAllKeys)
    .post((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .put((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .delete(removeAllKeys);

dataRouter.route('/keys/:key')
    .get(getOneKey)
    .post((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .put((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .delete(deleteOneKey);

export default dataRouter;