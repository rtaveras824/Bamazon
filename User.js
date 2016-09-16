var User = function(id, name, email) {
	this.id = id || '';
	this.name = name || '';
	this.email = email || '';
	this.type = 'User';

	this.initialOptions = function () {
		var choices = ['1', '2'];
		console.log(choices);
	}
}

module.exports = User;