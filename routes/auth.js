const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    // Проверка, существует ли пользователь
    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' })
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создание пользователя
    const user = await User.create({
      username,
      password: hashedPassword,
    })

    // Создание токена
    const token = jwt.sign(
      { id: user._id, username: username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message })
  }
})

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Поиск пользователя
    const user = await User.findOne({ username })
    
    if (!user) {
      return res.status(400).json({ message: `Пользователя ${username} не существует` })
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверное имя или пароль' })
    }

    // Создание токена
    const token = jwt.sign(
      { id: user._id, username: username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message })
  }
})

module.exports = router
