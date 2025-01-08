const {
  addGame,
  addCategory,
  deleteGame,
  modifyGame,
  modifyAdminAccess,
  addGameToCart,
  getCartItems,
  deleteCartItem,
  addReview,
  placeOrder,
  getOrders,
  updateOrderStatus
} = require('../controllers/req-auth')

const multer = require('multer');

// Set storage configuration for multer
const storage = multer.memoryStorage();  // Store the file in memory (buffer)
const upload = multer({ storage: multer.memoryStorage() });

const express = require('express')
const router = express.Router()

router.route('/admin').post(upload.fields([{ name: 'imgs' }]), addGame);
router.route('/admin/modifyAccess/:id').patch(modifyAdminAccess)
router.route('/admin/:id').delete(deleteGame).patch(upload.fields([{ name: 'image0' }, { name: 'image1' }]), modifyGame)
router.route('/admin/category').post(addCategory)
router.route('/cart/:id').post(addGameToCart).patch(deleteCartItem)
router.route('/cart').get(getCartItems)
router.route('/review/:id').post(addReview)
router.route('/order').get(getOrders).post(placeOrder).patch(updateOrderStatus)
module.exports = router