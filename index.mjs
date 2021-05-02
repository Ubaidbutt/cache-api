import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import config from './config.mjs';

const app = express();
app.use(bodyParser.json());

app.all('/', (req, res) => {
    return res.status(200).send({success: true, message: 'The API is working'});
});

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb connected at PORT 27017.');
        app.listen(config.webPort, () => console.log(`The web server is up and running at PORT ${config.webPort}`));
    })
    .catch((err) => console.log('Mongodb connection error: ', err.message));