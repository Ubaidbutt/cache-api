import Data from '../models/data.model.mjs';

import config from '../configurations/config.mjs';

const maxRecordLimit = config.maxCacheLimit;

import {nanoid} from 'nanoid';

// Helper function used to delete most lately used record in the cache depending on the updateAt key
const deleteLeastUsedEntry = async () => {
    try {
        const count = await Data.countDocuments({});
        console.log('Count: ', count); 
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

const getAllKeys = async (req, res) => {
    try {
        const data = await Data.find({}).select('key -_id').lean();
        const keys = data.map((record) => record.key); // Filter the keys into an array
        return res.status(200).send({success: true, data: keys});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

const createData = async (req, res) => {
    try {
        const { key, value } = req.body;
        if (key == null || value == null) {
            return res.status(400).send({success: false, error: 'key and value both are required fields'});
        }
        const data = await Data.findOne({key});
        if (!data) {
            await deleteLeastUsedEntry();
            const ttl = Date.now() + 3600000; // 1 hour
            const createdData = await Data.create({key, value, ttl});
            return res.status(201).send ({success: true, data: createdData});
        } else {
            await Data.findOneAndUpdate({key: key}, {$set: {value: value}}, {new: true, useFindAndModify: false});
            return res.status(204).send({success: true});
        }
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

const removeAllKeys = async (req, res) => {
    try {
        await Data.deleteMany({});
        return res.status(204).send({success: true});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

const deleteOneKey = async (req, res) => {
    try {
        const key = req.params.key;
        await Data.deleteOne({key: key});
        return res.status(204).send({success: true});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

const getOneKey = async (req, res) => {
    try {
        const key = req.params.key;
        const data = await Data.findOne({key: key, ttl: {$gt: Date.now() }});
        if (!data) {
            console.log('Cache miss');
            const value = nanoid(10);
            const dataObject = {
                key,
                value,
                ttl: Date.now() + 3600000
            };
            const data = await Data.findOne({key});
            if (!data) {
                await deleteLeastUsedEntry();
                const createdData = await Data.create(dataObject);
                return res.status(201).send ({success: true, data: createdData.value});
            } else {
                const updatedData = await Data.findOneAndUpdate({key: key}, {$set: {value: value}}, {new: true, useFindAndModify: false});
                return res.status(204).send({success: true, data: updatedData.value});
            }
        }
        console.log('Cache hit');
        await Data.findOneAndUpdate ({key: key}, {$set: {ttl: Date.now()+36000}}, {new: true, useFindAndModify: false});
        return res.status(200).send({success: true, data: data.value});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

export {getAllKeys, createData, removeAllKeys, deleteOneKey, getOneKey};