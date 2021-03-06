'use strict';

import express from 'express';
const dataRouter = express.Router();

import {
    getAllKeys, createData, deleteAllKeys,
    deleteOneKey, getOneKey
} from '../controllers/data.controller.mjs';


// All requests coming at : /data
dataRouter.route('/')
    .get((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .post(createData)
    .put((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .delete((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}));

// All requests coming at : /data/keys
dataRouter.route('/keys')
    .get(getAllKeys)
    .post((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .put((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .delete(deleteAllKeys);

// All requests coming at : /data/keys/:keyId
dataRouter.route('/keys/:key')
    .get(getOneKey)
    .post((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .put((req, res) => res.status(405).send({success: false, error: 'Method not allowed'}))
    .delete(deleteOneKey);

export default dataRouter;