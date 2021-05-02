import mongoose from 'mongoose';

import config from '../configurations/config.mjs';

const connection = mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

export default connection;