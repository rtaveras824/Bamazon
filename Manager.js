var User = require('./User.js');
var inquirer = require('inquirer');

var Manager = function() {
	this.type = 'Manager';
	
	this.initialOptions = function () {
		var choices = [
			'View Low Inventory', 
			'Add to Inventory',
			'Add New Product'
		];
		console.log("test");
		inquirer.prompt({
			type: 'list',
			name: 'options',
			message: 'Choose an option: ',
			choices: choices
		}).then(function(answers) {
			switch(answers.options) {
				case 'View Low Inventory':
					
					break;
				case 'Add To Inventory':

					break;
				case 'Add New Product':

					break;
			}
		});
	}
}

Manager.prototype = new User();

// console.log(Manager.prototype);
// console.log(Manager.prototype.type);
// console.log(Manager.type);
// console.log(User.prototype);

module.exports = Manager;