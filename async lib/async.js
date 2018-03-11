
var async = require('async')

var diff = Date.now();

// parallel
async.parallel([
	function(callback) {
		setTimeout(function() {
			console.log('one')
			callback(null, 'one')
		}, 400)
	},
	function(callback) {
		setTimeout(function() {
			console.log('two')
			callback(null, 'two')
		}, 100)
	},
],
function(error, result) {
	diff = Date.now() - diff
	console.log(diff)
	console.log(result)
})



// waterfall
async.waterfall([
	
	async.apply(User.findOne, {username: username}),
	
	function(user, callback) {
		if (user) {
			if (user.checkPassword(password)) {
				callback()
			}
			else {
				callback(404)
			}
		}
		else {
			var user = new User({username: username, password: password})
			user.save(callback)
		}
	}

], function(error, endup) {
	if (error) {
		return next(error)
	}
	else {
		// 200 OK
	}
})