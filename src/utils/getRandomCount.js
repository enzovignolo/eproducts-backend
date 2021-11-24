const getRandomCount = (cant) => {
	const randomCount = {};
	for (let i = 0; i < cant; i++) {
		const randomNumber = Math.floor(Math.random() * 1000) + 1;
		randomCount[randomNumber] = randomCount[randomNumber]
			? randomCount[randomNumber] + 1
			: 1;
	}
	return randomCount;
};
//const randomCount = getRandomCount(process.env.cant);
//process.send({ randomCount });

module.exports = getRandomCount;
