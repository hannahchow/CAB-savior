var http = require('http');
var https = require('https');

https.get('https://cab.brown.edu/asoc-api/?output=json&page=asoc.rjs&route=course&term=201720&course=CSCI%200160', (resp) => {
	let data = '';

	// A chunk of data has been recieved.
	resp.on('data', (chunk) => {
	data += chunk;
	});

	// The whole response has been received. Print out the result.
	resp.on('end', () => {
	// console.log(JSON.parse(data));
	var server = http.createServer(function(req, res) {
		res.writeHead(200);
		res.end(data);
	});
	server.listen(8080);

	});

}).on("error", (err) => {
  console.log("Error: " + err.message);
});