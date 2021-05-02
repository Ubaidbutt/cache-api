import {
    describe, it, before
} from 'mocha';

import Data from '../models/data.model.mjs';
import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

import app from '../index.mjs';

chai.use(chaiHttp);

describe('/data/keys Route', async () => {
    before(async () => {
        try {
            await Data.deleteMany();
        } catch(err) {
            throw new Error(err);
        }
    });

    before((done) => {
        app.on("ServerStarted", () => {
            done();
        });
    });

    it ('should return an empty array of keys', async () => {
        try {
            const response = await chai.request(app).get('/data/keys');
            response.should.have.status(200);
        } catch (err) {
            throw new Error(err);
        }
    });
});