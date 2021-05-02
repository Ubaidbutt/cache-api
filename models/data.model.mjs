'use strict';

import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true
    },
    value: {
        type: String,
        required: true
    },
    ttl: {
        type: Date
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const Data = mongoose.model('Data', schema);

export default Data;