import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import config from './config.mjs';

import DataRouter from './routers/data.router.mjs';

const app = express();
app.use(bodyParser.json());

app.all('/', (req, res) => {
    return res.status(200).send({success: true, message: 'The API is working'});
});

app.use('/data', DataRouter);

app.use((req, res) => {
    return res.status(400).send('Route not found');
})

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb connected at PORT 27017.');
        app.listen(config.webPort, () => console.log(`The web server is up and running at PORT ${config.webPort}`));
        app.emit('ServerStarted'); // To make sure mocha starts only after the server has started
    })
    .catch((err) => console.log('Mongodb connection error: ', err.message));

export default app;