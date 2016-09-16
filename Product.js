var Product = function(id, name, price, quantity, department) {
	this.id = id;
	this.name = name;
	this.price = price;
	this.quantity = quantity;
	this.department = department;

	this.setQuantity = function(n) {
		this.quantity = n;
	}
}

module.exports = Product;