const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

// Получить статистику пользователя
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.json({ clicks: user.clicks, coins: user.coins })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

// Увеличить клики и монеты пользователя
router.post('/increment', auth, async (req, res) => {
  try {
    // Получение пользователя, чтобы узнать его clickPower
    const user = await User.findByIdAndUpdate(
      req.user.id,
      [
        {
          $set: {
            clicks: { $add: ['$clicks', 1] },
            coins: { $add: ['$coins', '$clickPower'] } // получение clickPower из самого документа
          }
        }
      ],
      {
        returnDocument: 'after',
        updatePipeline: true
      } // вернуть обновлённый документ
    )

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.json({ clicks: user.clicks, coins: user.coins })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

module.exports = router
