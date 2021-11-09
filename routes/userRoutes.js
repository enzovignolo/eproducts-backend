const { Router } = require('express');
const userControllers = require(`${__dirname}/../controllers/userControllers`);
const router = Router();

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .put(userControllers.updateUser)
  .delete(userControllers.deleteUser);

router.route('/:id/carrito').get(userControllers.getUserCart);
router.route('/:id/comprar').post(userControllers.makePurchase);
router
  .route('/:id/carrito/:productId')
  .put(userControllers.updateUserCart)
  .delete(userControllers.deleteFromUserCart);

module.exports = router;
