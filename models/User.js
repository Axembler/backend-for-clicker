const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickPower: {
    type: Number,
    default: 1,
  },
  coins: {
    type: Number,
    default: 0,
  },
  totalCoins: {
    type: Number,
    default: 0,
  },
  passiveIncome: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array,
    default: [],
  },
  lastOnline: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  collection: 'users'
})

const User = mongoose.model('User', userSchema)

module.exports = User
