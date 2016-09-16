var Product = require('./Product.js');

var ShoppingCart = function() {
	this.products = [];

	this.add = function(product, quantity) {
		product.setQuantity(quantity);
		this.products.push(product);
	}

	this.remove = function() {

	}

	this.modifyQuantity = function() {

	}
}

module.exports = ShoppingCart;