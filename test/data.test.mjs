import {
    describe, it, before, after
} from 'mocha';

import Data from '../models/data.model.mjs';
import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

import app from '../index.mjs';

chai.use(chaiHttp);

describe('Cache API routes', async () => {
    before(async () => {
        try {
            await Data.deleteMany();
        } catch(err) {
            throw new Error(err);
        }
    });

    after(async () => {
        try {
            await Data.deleteMany();
        } catch(err) {
            throw new Error(err);
        }
    });

    describe('/data/keys route', async () => {
        it ('should return an empty array of keys', async () => {
            try {
                const response = await chai.request(app).get('/data/keys');
                response.should.have.status(200);
            } catch (err) {
                throw new Error(err);
            }
        });

        it ('should delete all the keys in the cache', async () => {
            try {
                const response = await chai.request(app).delete('/data/keys');
                response.should.have.status(204);
            } catch (err) {
                throw new Error(err);
            }
        });

        it ('should return a 405 Method now allowed error', async () => {
            try {
                const response = await chai.request(app).put('/data/keys');
                response.should.have.status(405);
                response.body.success.should.be.false;
            } catch (err) {
                throw new Error(err);
            }
        });
    });

    describe('/data route', async () => {
        it('should create an entry in the cache', async () => {
            try {
                const dummyObject = {
                    key: 'AB-1',
                    value: 'Ubaid'
                };
                const response = await chai.request(app).post('/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                response.should.have.status(201);
                response.body.success.should.be.true;
                response.body.data.should.have.ownProperty('_id');
            } catch(err) {
                throw new Error(err);
            }
        });

        it('should update the value if the key already exists', async () => {
            try {
                const dummyObject = {
                    key: 'AB-1',
                    value: 'Ubaid Updated'
                };
                const response = await chai.request(app).post('/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                response.should.have.status(204);
            } catch(err) {
                throw new Error(err);
            }
        });

        it('should throw a 400 error if required fields are not provided', async () => {
            try {
                const dummyObject = {
                    key: 'AB-1'
                };
                const response = await chai.request(app).post('/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                response.should.have.status(400);
                response.body.success.should.be.false;
                response.body.should.have.ownProperty('error');
            } catch(err) {
                throw new Error(err);
            }
        });

        it('should throw a 400 error if the data type is not string type', async () => {
            try {
                const dummyObject = {
                    key: 123,
                    value: {
                        name: 'test'
                    }
                };
                const response = await chai.request(app).post('/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                response.should.have.status(400);
                response.body.success.should.be.false;
                response.body.should.have.ownProperty('error');
            } catch(err) {
                throw new Error(err);
            }
        });
    });

    describe('/data/keys/:key route', async () => {
        it ('should return a random string if the key does not exist', async () => {
            try {
                const response = await chai.request(app).get('/data/keys/1');
                response.should.have.status(201);
                response.body.success.should.be.true;
                response.body.data.should.be.a('string');
            } catch (err) {
                throw new Error(err);
            }
        });

        it ('should return a value if the key exist', async () => {
            try {
                // We created a record with AB-1 in the previous test
                const response = await chai.request(app).get('/data/keys/AB-1');
                response.should.have.status(200);
                response.body.data.should.be.a('string');
            } catch (err) {
                throw new Error(err);
            }
        });

        it ('should return a 405 Method now allowed error', async () => {
            try {
                const response = await chai.request(app).put('/data/keys/1');
                response.should.have.status(405);
                response.body.success.should.be.false;
            } catch (err) {
                throw new Error(err);
            }
        });
    });
});