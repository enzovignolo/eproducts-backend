const fs = require('fs');

class Archivo {
	constructor(filePath, encoding = 'UTF-8') {
		this.filePath = filePath;
		this.encoding = encoding;
	}

	async saveData(newData) {
		try {
			//Reads the previous data
			const data = await this.readData();
			//If there wasn't or the file didn't exist, it writes the file
			if (!data || JSON.stringify(data) == '') {
				newData = [
					{
						id: 1,
						...newData,
					},
				];
				await fs.promises.writeFile(this.filePath, JSON.stringify(newData));
			} else {
				// If there was pre-existing data, only need to append new one
				//Looks for the current maximum id
				const maxId = Math.max(
					...data.map((element) => {
						return element.id;
					})
				);

				//add de id for the newData as +1 of the current maximum id
				newData = {
					id: maxId + 1,
					...newData,
				};
				data.push(newData);

				await fs.promises.writeFile(this.filePath, JSON.stringify(data));
			}
			return newData;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async readData() {
		try {
			//Try to read the file
			const dataString = await fs.promises.readFile(
				this.filePath,
				this.encoding
			);
			//Parse the data to an array of products
			const data = JSON.parse(`${dataString}`);
			return data;
		} catch (err) {
			//If the file does not exist, it creates it and try again
			if (err.code == 'ENOENT') {
				await fs.promises.writeFile(this.filePath, '');
				await this.readData();
			} else {
				//If not, show error on console
				console.log(err);
			}
		}
	}
	async deleteFile() {
		try {
			await fs.promises.unlink(`${this.filePath}`);
		} catch (err) {
			//Si el archivo no existe, muestra el error
			if (err.code == 'ENOENT') {
				err.message($`{File ${this.filePath} does not exist}`);
				return err;
			}
		}
	}

	async findDataById(id) {
		try {
			const data = await this.readData();
			const foundElement = data.find((element) => element.id == id);
			return foundElement;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async findByIdAndUpdate(id, updateData) {
		try {
			//Read all te data
			let data = await this.readData();
			let updatedElement;
			data.map((element) => {
				//Loop through the element with same id given
				if (element.id == id) {
					//Loop through fields to be updated on our element
					Object.entries(updateData).map((keyValue) => {
						//Only update the if the property already existed
						// and is NOT the id
						if (
							element.hasOwnProperty(keyValue[0]) &&
							keyValue[0] != 'id'
						) {
							element[keyValue[0]] = keyValue[1];
						}
					});
					updatedElement = element;
				}
			});
			if (!updatedElement) throw new Error('There is no element with that id');
			await fs.promises.writeFile(this.filePath, JSON.stringify(data));
			return updatedElement;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async findByIdAndDelete(id) {
		try {
			//Read all te data
			let data = await this.readData();
			let deletedElement;
			const updatedData = data.filter((element) => {
				if (element.id == id) deletedElement = element;
				else return true;
			});
			if (!deletedElement) throw new Error('There is no element with that id');
			await fs.promises.writeFile(this.filePath, JSON.stringify(updatedData));
			return deletedElement;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
}

/* (async () => {
	const file = new Archivo(`${__dirname}/../db/products.txt`);
	await file.findDataByIdAndUpdate(1, { title: 'regla2', price: 8, email: 'eee' });
})(); */

module.exports = Archivo;
