var inquirer = require('inquirer');
var crypto = require('crypto-js');
var mysql = require('mysql');

var User = require('./User.js');
var Manager = require('./Manager.js');
var Executive = require('./Executive.js');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bamazon'
});

var type = ['User', 'Manager', 'Executive'];

inquirer.prompt([{
	type: 'list',
	name: 'type',
	message: 'Choose an account type: ',
	choices: type
}, {
	type: 'list',
	name: 'signOrLog',
	message: 'Log in or sign up: ',
	choices: ['Log In', 'Sign Up']
}]).then(function(answers) {
	type_id = type.indexOf(answers.type) + 1;
	if(answers.signOrLog === 'Log In') {
		logIn(type_id);
	} else {
		signUp(type_id);
	}
		
});

function signUp(type) {
	inquirer.prompt({
		type: 'input',
		name: 'username',
		message: 'Enter a username: '
	}).then(function(answer) {
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
			var encrypt = crypto.AES.encrypt(answers.password, "Rock Out");
			var decrypt = crypto.AES.decrypt(encrypt.toString(), "Rock Out");
			// var password = decrypt.toString(crypto.enc.Utf8);
			

			var options = {
				user_id: null,
				username: answer.username,
				password: encrypt.toString(),
				type_id: type_id
			}
			connection.query('INSERT INTO users SET ?', options, function(err, res) {
				if (err) throw err;
				logInOptions(type);
			});

			
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
			logInOptions(type);
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

function logInOptions(type) {
	switch(type) {
		case 1:
			var user = new User();
			user.initialOptions();
			break;
		case 2:
			var manager = new Manager();
			manager.initialOptions();
			break;
		case 3:
			var executive = new Executive;
			break;
		
	}
}