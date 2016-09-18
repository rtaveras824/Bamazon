var Product = require('./Product.js');

var ShoppingCart = function() {
	this.products = [];

	this.add = function(product, quantity) {
		product.setQuantity(quantity);
		this.products.push(product);
	}

	this.remove = function(index) {
		this.products.splice(index, 1);
	}

	this.modifyQuantity = function(index, quantity) {
		this.products[index].quantity = quantity;
	}

	this.getTotal = function() {
		var sum = 0.00;
		this.products.forEach(function(product, index) {
			var productTotal = product.price * product.quantity;
			sum += productTotal;
		})
		return sum;
	}
}

module.exports = ShoppingCart;