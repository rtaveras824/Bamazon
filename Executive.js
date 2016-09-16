var Manager = require('./Manager');

var Executive = function() {
	this.type = 'Executive';
	this.initialOptions = function() {
		var choices = ['5', '6'];
		console.log(choices);
	}
}

Executive.prototype = new Manager();

module.exports = Executive;