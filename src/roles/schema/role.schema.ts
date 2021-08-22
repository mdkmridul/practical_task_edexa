import * as mongoose from 'mongoose';

export const RoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  actions: [{
    type: String,
    enum: ["Create", "Update", "Read", "Delete"]
  }]
})