import Data from '../models/data.model.mjs';
import {nanoid} from 'nanoid';

const getAllKeys = async (req, res) => {
    try {
        const keys = await Data.find({}).select('key -_id').lean();
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
        console.log ('Data: ', data);
        if (!data) {
            const ttl = Date.now() + 3600000; // 1 hour
            const createdData = await Data.create({key, value, ttl});
            return res.status(201).send ({success: true, data: createdData});
        } else {
            const updatedData = await Data.findOneAndUpdate({key: key}, {$set: {value: value}}, {new: true, useFindAndModify: false});
            console.log('Updated data: ', updatedData);
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
        const data = await Data.findOne({key: key});
        if (!data) {
            console.log('Cache miss');
            const value = nanoid(10);
            const dataObject = {
                key,
                value,
                ttl: Date.now() + 3600000
            };
            const createdData = await Data.create(dataObject);
            return res.status(201).send({success: true, data: createdData.value}); // Explicitly asked to send only the newly created random string
        }
        console.log('Cache hit');
        return res.status(200).send({success: true, data: data.value});
    } catch(err) {
        return res.status(500).send({success: false, error: err.message});
    }
}

export {getAllKeys, createData, removeAllKeys, deleteOneKey, getOneKey};