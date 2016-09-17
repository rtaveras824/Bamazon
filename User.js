var inquirer = require('inquirer');
var mysql = require('mysql');
var ShoppingCart = require('./ShoppingCart.js');
var Product = require('./Product.js');

var shoppingcart = new ShoppingCart();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bamazon'
});

function createAndEndConnection(query, callback) {
	connection.connect(function(err) {
		if (err) throw err;
		console.log('connected as id ' + connection.threadId);
		connection.query(query, function(err, res) {
			if (err) throw err;
			callback(res);
			connection.end();
		});
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
		var departmentId = productData.department_id;
		var product = new Product(id, name, price, quantity, departmentId);
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
	console.log(productNames.length);
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
				console.log("GERTA");
				var productIndex = productNames.indexOf(answer.product);
				
				shoppingcart.add(productList[productIndex], answers.quantity);
				productList.splice(productIndex, 1);
				productNames.splice(productIndex, 1);

				console.log(shoppingcart.products);
				addQuantity(productList);
				
			});
		}
	});
}

function shoppingCartOptions() {
	inquirer.prompt({
		type: 'list',
		name: 'option',
		message: 'Shopping Cart Options',
		choices: ['Remove product', 'Modify quantity', 'Place order']
	}).then(function(answer) {
		switch(answer.option) {
			case 'Remove product':

				break;
			case 'Modify quantity':
				break;
			case 'Place order':
				break;
		}
	});
}

function removeProduct() {
	inquirer.prompt({
		type: ''
	})
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
					query = 'SELECT * FROM products';
					createAndEndConnection(query, addProductToCart);
					break;
				case 'See Shopping Cart':
					break;
			}
		});
	}
}

module.exports = User;