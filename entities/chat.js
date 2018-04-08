
var clients = []

exports.subscribe = function(req, res) {
	clients.push(res)

	res.on('close', function() {
		clients.splice(clients.indexOf(res), 1)
	})
}

exports.publish = function(message) {
	clients.forEach(function(res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8')	
		res.end(message)
	})
	clients = []
}