import Data from '../models/data.model.mjs';

import config from '../configurations/config.mjs';

// Constants
const maxRecordLimit = config.maxCacheLimit;
const TTL = parseInt(config.timeToLive);

import {nanoid} from 'nanoid';

// Helper function used to delete most lately used record in the cache depending on the updateAt key
// This process is known as cache eviction policy - my implementation aligns with Least Recently Used
const deleteLeastUsedEntry = async () => {
    try {
        const count = await Data.countDocuments({});
        console.log('Record count: ', count); 
        if (count >= maxRecordLimit) {
            const leastUsedRecord = await Data.findOne({}, {}, { sort: { 'updatedAt' : 1 } });
            console.log('Least used record: ', leastUsedRecord);
            await Data.deleteOne({_id: leastUsedRecord._id});
            return;
        }
    } catch(err) {
        throw new Error(err);
    }
}

// Helper function to create a record in the cache - it was being used in two controller function
const createCacheRecord = async (object = null) => {
    try {
        if (object == null) {
            throw new Error('Null value passed to store cache record.')
        }
        const {key, value} = object;
        if (key == null || value == null) {
            return {status: 400, error: 'key and value both are required fields.'}
        }
        const data = await Data.findOne({key});
        if (!data) {
            await deleteLeastUsedEntry();
            const ttl = Date.now() + TTL;
            const createdData = await Data.create({key, value, ttl});
            return {status: 201, data: createdData};
        } else {
            const updatedData = await Data.findOneAndUpdate({key: key}, {$set: {value: value}}, {new: true, useFindAndModify: false});
            return {status: 204, data: updatedData};
        }
    } catch(err) {
        throw new Error(err);
    }
} 

// A route that returns a list of all the keys in an array
const getAllKeys = async (req, res) => {
    try {
        const data = await Data.find({}).select('key -_id').lean();
        const keys = data.map((record) => record.key); // Filter the keys into an array
        return res.status(200).send({success: true, data: keys});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

// Route to create a record in the cache database - 'key' and 'value' are required parameters
const createData = async (req, res) => {
    try {
        const result = await createCacheRecord(req.body);
        const {status, data, error} = result;
        if(status === 204) {
            return res.status(status).end();
        }
        if(status === 400) {
            return res.status(status).send({success: false, error: error});
        }
        return res.status(status).send({success: true, data: data});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

// Route to delete all the keys from the cache
const removeAllKeys = async (req, res) => {
    try {
        await Data.deleteMany({});
        return res.status(204).end();
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

// Route to delete one key from the cache
const deleteOneKey = async (req, res) => {
    try {
        const key = req.params.key;
        await Data.deleteOne({key: key});
        return res.status(204).end();
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

// Find one specific key from cache
const getOneKey = async (req, res) => {
    try {
        const key = req.params.key;
        const data = await Data.findOne({key: key, ttl: {$gt: Date.now() }});
        if (!data) {
            console.log('Cache miss');
            const value = nanoid(10);
            console.log('Random value: ', value);
            const dataObject = {
                key,
                value
            };
            const result = await createCacheRecord(dataObject);
            const {status, data, error} = result;
            if(status === 204) {
                return res.status(204).send({success: true, data: data.value});
            }
            if(status === 400) {
                return res.status(status).send({success: false, error: error});
            }
            return res.status(status).send({success: true, data: data.value});
        }
        console.log('Cache hit');
        await Data.findOneAndUpdate ({key: key}, {$set: {ttl: Date.now()+TTL}}, {new: true, useFindAndModify: false});
        return res.status(200).send({success: true, data: data.value});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

export {
    getAllKeys, createData, 
    removeAllKeys, deleteOneKey, getOneKey
};