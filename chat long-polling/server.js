
var http = require('http')
var url = require('url')

var fs = require('fs')
var domain = require('domain')

var chat = require('./entities/chat')

var server = new http.Server()

server.on('request', function(req, res) {

	var urlParsed = url.parse(req.url, true)

	switch(urlParsed.pathname) {
		
		case '/domain':
			
			var reqDomain = domain.create()

			var throwRefError = function() {
				throw {name: 'NoError', message: 'Test error'}
			} 
			reqDomain.on('error', function(error) {
				console.log('Domain: %s', error)
			})
			reqDomain.run(function() {
				throwRefError()
			})
			break

		case '/':
			res.setHeader('Content-Type', 'text/html; charset=utf-8')
			sendFile('entities/entity.html', res)
			break

		case '/subscribe':
			chat.subscribe(req, res)
			break

		case '/publish':
			var body = String(), data
			req.on('readable', function() {
				if ((data = req.read()) != null) {
					body = body + data
				}
				if (body.length > 1e4) {
					// No need to read this readable stream
					req.emit('close')
					res.statusCode = 413
					res.end('Your message is too big')
				}
			})
			req.on('close', function() {
				req.removeListener('close')
				req.destroy()
			})
			req.on('end', function() {
				try {
					body = JSON.parse(body)
				}
				catch(ex) {
					res.statusCode = 400
					return res.end('Bad Request')
				}
				chat.publish(body.message)
				res.end()
			})
			break

		default: 
			res.statusCode = 404
			res.end('404 Not Found')
	}

})

server.listen(1234, '127.0.0.1')

function sendFile(filename, res) {
	var fileStream = fs.createReadStream(filename)
	
	fileStream.on('error', function() {
		res.statusCode = 500
		res.end('500 Server error')
	})

	res.on('close', function() {
		fileStream.destroy()
	})

	fileStream.pipe(res)

	// fileStream -> open -> [end (all data reseived) -> destroy()] -> close
}