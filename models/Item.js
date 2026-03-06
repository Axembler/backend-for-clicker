const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  clickPowerBonus: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  passiveIncomeBonus: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sortOrder: {
    type: Number,
    required: true,
    default: 0,
  },
  color: {
    type: String,
    required: true,
    match: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, // валидация HEX цвета
  }
}, {
  collection: 'items'
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
