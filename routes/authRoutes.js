const { Router } = require('express');
const authController = require(`${__dirname}/../controllers/authControllers.js`);

const router = Router();

router.route('/login').post(authController.login);

module.exports = router;
