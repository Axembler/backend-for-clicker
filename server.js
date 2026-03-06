const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const counterRoutes = require('./routes/counter')
const authRoutes = require('./routes/auth')
const itemsRoutes = require('./routes/items')
const userRoutes = require('./routes/user')

const app = express()

app.use(cors())
app.use(express.json())

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch((err) => console.log('❌ Ошибка:', err))

// Роуты
app.use('/counter', counterRoutes)
app.use('/auth', authRoutes)
app.use('/items', itemsRoutes)
app.use('/user', userRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`Сервер запущен на порту ${process.env.PORT}`)
})
