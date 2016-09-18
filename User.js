var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

var ShoppingCart = require('./ShoppingCart.js');
var Product = require('./Product.js');

var shoppingcart = new ShoppingCart();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bamazon'
});

function sendQuery(query, options, callback) {
	connection.query(query, options, function(err, res) {
		if (err) throw err;
		callback(res);
	});
}

function addProductToCart(products) {
	var productList = []
	for(var i = 0; i < products.length; i++) {
		var productData = products[i];
		var id = productData.product_id;
		var name = productData.product_name;
		var price = productData.price;
		var quantity = productData.quantity;
		var department = productData.department_name;
		var product = new Product(id, name, price, quantity, department);
		productList.push(product);
	}
	addQuantity(productList);
}

function addQuantity(productList) {
	var productNames = [];
	for (var i = 0; i < productList.length; i++) {
		productNames.push(productList[i].name);
	}
	productNames.push('---Checkout to Shopping Cart---');
	inquirer.prompt({
		type: 'list',
		name: 'product',
		message: 'Choose a product',
		choices: productNames
	}).then(function(answer) {
		if(answer.product === '---Checkout to Shopping Cart---') {
			shoppingCartOptions();
		} else {
			inquirer.prompt({
				type: 'input',
				name: 'quantity',
				message: 'How much do you want?'
			}).then(function(answers) {
				var productIndex = productNames.indexOf(answer.product);
				
				shoppingcart.add(productList[productIndex], answers.quantity);
				productList.splice(productIndex, 1);
				productNames.splice(productIndex, 1);

				addQuantity(productList);
				
			});
		}
	});
}

function createTable() {
	// instantiate 
	var table = new Table({
	    head: ['Product Name', 'Department', 'Quantity']
	});
	 
	// table is an Array, so you can `push`, `unshift`, `splice` and friends 
	for(var i = 0; i < shoppingcart.products.length; i++) {
		var productData = shoppingcart.products[i];
		var product = [productData.name, productData.department, productData.quantity];
		table.push(
		    product
		);
	}
	
	console.log(table.toString());
	
}

function shoppingCartOptions() {
	createTable();
	inquirer.prompt({
		type: 'list',
		name: 'option',
		message: 'Shopping Cart Options',
		choices: ['Remove product', 'Modify quantity', 'Place order']
	}).then(function(answer) {
		var productNames = [];
		for (var i = 0; i < shoppingcart.products.length; i++) {
			productNames.push(shoppingcart.products[i].name);
		}
		productNames.push('---Stop---')
		switch(answer.option) {
			case 'Remove product':
				removeProduct(productNames);
				break;
			case 'Modify quantity':
				modifyQuantity(productNames);
				break;
			case 'Place order':
				placeOrder();
				break;
		}
	});
}

function placeOrder(productNames) {
	var query = 'INSERT INTO orders SET ?';
	var options = {
		order_id: null,
		user_id: 1,
		order: JSON.stringify(shoppingcart.products),
		total: shoppingcart.getTotal()
	};
	sendQuery(query, options, sendConfirmationEmail);
}

function sendConfirmationEmail() {
	console.log("Confirmation email sent to fake email...");
	function update(num) {
		if (num > 0) {
			var product = shoppingcart.products[num-1];
			connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + connection.escape(product.quantity) + ' WHERE product_id = ' + connection.escape(product.id), function(err, res) {
				if (err) throw err;
				update(num-1);
			});
		}
	}
	update(shoppingcart.products.length);
	// process.exit();
}

function modifyQuantity(productNames) {
	inquirer.prompt({
		type: 'list',
		name: 'modify',
		message: 'Choose product to modify quantity',
		choices: productNames
	}).then(function(answer) {
		if(answer.modify === '---Stop---') {
			shoppingCartOptions();
		} else {
			var index = productNames.indexOf(answer.modify);
			inquirer.prompt({
				type: 'input',
				name: 'quantity',
				message: 'Enter new quantity'
			}).then(function(answer) {
				shoppingcart.modifyQuantity(index, answer.quantity);
				modifyQuantity(productNames);
			});
		}
	})
}

function removeProduct(productNames) {
	inquirer.prompt({
		type: 'list',
		name: 'remove',
		message: 'Choose product to remove',
		choices: productNames
	}).then(function(answer) {
		if(answer.remove === '---Stop---') {
			shoppingCartOptions();
		} else {
			var index = productNames.indexOf(answer.remove);
			productNames.splice(index, 1);
			shoppingcart.remove(index);
			removeProduct(productNames);
		}
	});
}

var User = function(id, name, email) {
	this.id = id || '';
	this.name = name || '';
	this.email = email || '';
	this.type = 'User';

	this.initialOptions = function () {
		var choices = [
			'See Products', 
			'See Shopping Cart'
		];

		inquirer.prompt({
			type: 'list',
			name: 'options',
			message: 'Choose an option: ',
			choices: choices
		}).then(function(answers) {
			switch(answers.options) {
				case 'See Products':
					query = `SELECT p.product_id, p.product_name, p.price, p.stock_quantity, d.department_name
							FROM departments AS d, products AS p WHERE p.department_id = d.department_id`;
					sendQuery(query, null, addProductToCart);
					break;
				case 'See Shopping Cart':
					if (shoppingcart.products.length < 1) {
						this.initialOptions();
					}
					break;
			}
		}.bind(this));
	}
}

module.exports = User;