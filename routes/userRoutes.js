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

module.exports = router;
