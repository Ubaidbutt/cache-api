import express from 'express';
import bodyParser from 'body-parser';

import config from './configurations/config.mjs';

import connection from './database/mongoose.mjs';

import DataRouter from './routers/data.router.mjs';

const PORT = config.webPort;
const app = express();

app.use(bodyParser.json());

// Test route
app.all('/', (req, res) => {
    return res.status(200).send({success: true, message: 'The API is working'});
});

app.use('/data', DataRouter);

// Error handling
app.use((req, res) => {
    return res.status(400).send('Route not found');
});

connection
    .then(() => {
        console.log('Mongodb connected');
        app.listen(PORT, () => console.log(`The web server is up and running at PORT ${PORT}`));
    })
    .catch(err => {
        console.log('Mongodb connection error: ', err.message);
    });

export default app;