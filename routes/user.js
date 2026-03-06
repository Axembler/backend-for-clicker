const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const passiveIncome = require('../middleware/passiveIncome')

// Получить объект пользователя (без пароля)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

// Получить предметы пользователя
router.get('/items', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('items')
    res.json(user.items)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// POST /api/user/wakeup — вызывается при ВОЗВРАТЕ в приложение
// Начисляет пассивный доход и обновляет lastOnline
router.post('/wakeup', auth, passiveIncome, (req, res) => {
  const user = req.userDoc
  res.json({
    id: user._id,
    username: user.username,
    coins: user.coins,
    totalCoins: user.totalCoins,
    clicks: user.clicks,
    clickPower: user.clickPower,
    passiveIncome: user.passiveIncome,
    items: user.items,
    passiveEarned: req.passiveEarned || 0,
    passiveSeconds: req.passiveSeconds || 0,
  })
})

// POST /api/user/sleep — вызывается когда пользователь УХОДИТ из приложения
// Фиксирует время ухода
router.post('/sleep', auth, async (req, res) => {
  try {
    const clientSleepAt = req.body?.sleepAt
    const now = Date.now()
    
    const lastOnline = (clientSleepAt && clientSleepAt <= now)
      ? new Date(clientSleepAt)
      : new Date()

    await User.findByIdAndUpdate(req.user.id, { lastOnline })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
