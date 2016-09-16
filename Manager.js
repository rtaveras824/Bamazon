var User = require('./User.js');

var Manager = function() {
	this.type = 'Manager';
	this.initialOptions = function() {
		var choices = ['3', '4'];
		console.log(choices);
	}
}

Manager.prototype = new User();

module.exports = Manager;