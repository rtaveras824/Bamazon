var inquirer = require('inquirer');

var User = require('./User.js');
var Manager = require('./Manager.js');
var Executive = require('./Executive.js');

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
	if(answers.signOrLog === 'Log In') {
		logIn(answers.type);
	} else {
		signUp(answers.type);
	}
		
});

function signUp(type) {
	inquirer.prompt({
		type: 'input',
		name: 'username',
		message: 'Enter a username: '
	}).then(function(answers) {
		//Enter user into database
		inquirer.prompt({
			type: 'password',
			name: 'password',
			message: 'Enter a password at least 6 characters and at least one uppercase letter: ',
			validate: function(value) {
				if(value.length > 5 && /[A-Z]/.test(value)) {
					return true;
				} else {
					return false;
				}
			}
		}).then(function(answers) {
			//Enter answer in database
			options(type);
		})
	})
}

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
			options(type);
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

function options(type) {
	switch(type) {
		case 'User':
			console.log('user');
			var user = new User();
			user.initialOptions();
			break;
		case 'Manager':
			var manager = new Manager();
			manager.initialOptions();
			break;
		case 'Executive':
			var executive = new Executive;
			break;
		
	}
}