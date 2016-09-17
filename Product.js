var Product = function(id, name, price, quantity, departmentId) {
	this.id = id;
	this.name = name;
	this.price = price;
	this.quantity = quantity;
	this.departmentId = departmentId;

	this.setQuantity = function(n) {
		this.quantity = n;
	}
}

module.exports = Product;