const User = require('../models/User')

const MAX_OFFLINE_HOURS = 8
const MIN_OFFLINE_SECONDS = 1

const passiveIncome = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const now = new Date()
    const lastOnline = new Date(user.lastOnline)

    const diffSeconds = Math.floor((now - lastOnline) / 1000)

    // Если прошло хотя бы 1 секунда и есть пассивный доход
    if (diffSeconds >= MIN_OFFLINE_SECONDS && user.passiveIncome > 0) {
      const maxSeconds = MAX_OFFLINE_HOURS * 3600
      const effectiveSeconds = Math.min(diffSeconds, maxSeconds)
      const earned = Math.floor(user.passiveIncome * effectiveSeconds)

      if (earned > 0) {
        user.coins += earned
        user.totalCoins += earned
        req.passiveEarned = earned
        req.passiveSeconds = effectiveSeconds
      }
    }

    user.lastOnline = now

    await user.save()

    req.userDoc = user

    next()
  } catch (err) {
    console.error('Ошибка passiveIncome middleware:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}

module.exports = passiveIncome
