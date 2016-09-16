var inquirer = require('inquirer');

inquirer.prompt([{
	type: 'list',
	name: 'type',
	message: 'Choose an account type: ',
	choices: ['User', 'Manager', 'Executive']
}, {
	type: 'list',
	name: 'signOrLog',
	message: 'Log in or sign up: ',
	choices: ['Log In', 'Sign Up']
}]).then(function(answers) {
		logIn(answers.type);
});

function logIn(type) {
	inquirer.prompt([{
		type: 'input',
		name: 'username',
		message: 'Enter a username: '
	}, {
		type: 'password',
		name: 'password',
		message: 'Enter a password'
	}]).then(function(answers) {
		//Check database if username and password match
		var match = true;
		if (match) {
			switch(answers.type) {
				case 'User':
					var User = require('./User.js');
					break;
				case 'Manager':
					var Manager = require('./Manager.js');
					break;
				case 'Executive':
					var Executive = require('./Executive.js');
					break;
				console.log("YOURE IN");
			}
		} else {
			inquirer.prompt({
				type: 'list',
				name: 'retry',
				message: 'Try again or cancel: ',
				choices: ['Try Again', 'Cancel']
			}).then(function(answers) {
				if(answers.retry === 'Try Again') {
					logIn(type);
				} else {
					//close program
				}
			});
		}
	});
}
