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
        type: Date,
        required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

schema.index({key: 1}, {unique: true});
const Data = mongoose.model('Cache', schema);

export default Data;