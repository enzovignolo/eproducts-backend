const queryBuilder = (e) => {
	e.preventDefault();
	console.log(e.target.name.value);
	window.location.replace('/addProduct');
};
