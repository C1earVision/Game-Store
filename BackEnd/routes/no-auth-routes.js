const {getAllGames, getGame, getCategories} = require('../controllers/no-auth')

const express = require('express')
const router = express.Router()

router.route('/products').get(getAllGames)
router.route('/categories').get(getCategories)
router.route('/products/:id').get(getGame)

module.exports = router