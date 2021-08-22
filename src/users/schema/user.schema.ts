import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true, 
    required: true,
    unique: true,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  password: {
    type: String,
    required: true,
    select: false,
  },
  sessions: [String],
  actions: [String],
},
{
  timestamps: true,
})