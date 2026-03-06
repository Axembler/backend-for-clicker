const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Item = require('../models/Item')
const auth = require('../middleware/auth')

// Получить все предметы из магазина
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find().sort({ sortOrder: 1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

// Купить предмет
router.post('/buy/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params

    // Ищем предмет в магазине
    const item = await Item.findById(itemId)
    if (!item) {
      return res.status(404).json({ message: 'Предмет не найден' })
    }

    // Ищем пользователя
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    // Проверяем, хватает ли монет
    if (user.coins < item.price) {
      return res.status(400).json({ message: 'Недостаточно монет' })
    }

    const alreadyOwned = user.items.some(i => i._id.toString() === itemId)

    if (alreadyOwned) {
      return res.status(400).json({ message: 'Предмет уже куплен' })
    }

    // Обновляем пользователя:
    // - списываем монеты
    // - добавляем бонусы от предмета
    // - добавляем предмет в инвентарь
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          coins: -item.price,
          clickPower: +item.clickPowerBonus,
          passiveIncome: +item.passiveIncomeBonus,
        },
        $push: {
          items: {
            _id: item._id,
            name: item.name
          }
        }
      },
      { returnDocument: 'after' }
    )

    res.json({
      message: `Предмет "${item.name}" успешно куплен`,
      coins: updatedUser.coins,
      clickPower: updatedUser.clickPower,
      passiveIncome: updatedUser.passiveIncome,
      items: updatedUser.items,
    })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message })
  }
})

module.exports = router
