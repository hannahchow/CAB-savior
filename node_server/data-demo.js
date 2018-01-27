send_email => {
	var email = require("emailjs");

	var server = email.server.connect({
	   user:    "cabsavior@gmail.com", 
	   password:"Graduate20", 
	   host:    "smtp.gmail.com", 
	   ssl:     true
	});

	// send the message and get a callback with an error or details of the message that was sent
	server.send({
	   text:    "i hope this works", 
	   from:    "CAB Savior <cabsavior@gmail.com>", 
	   to:      "Hannah <hannah_chow@brown.edu>",
	   cc:      "else <else@your-email.com>",
	   subject: "testing emailjs"
	}, function(err, message) { console.log(err || message); });
}

var http = require('http');
var https = require('https');
const { URL, URLSearchParams } = require('url');

var server = http.createServer(function(req, res) {
	var code = "";
	var params = new URLSearchParams(req.url.substr(2));
	for (const [name, value] of params) {
	  if(name == "course_code") {
	  	code = value;
	  }
	}
	var body = "";
	if(code == "") {
		res.writeHead(400);
		res.end("Error: course code not supplied!");
	} else {
		https.get('https://cab.brown.edu/asoc-api/?output=json&page=asoc.rjs&route=course&term=201720&course=' + code, (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				var parsed = JSON.parse(data);
				res.writeHead(200);
				if(parsed['error'] != null) {
					res.end("Error: course not found!");
				} else {
					res.end("Title: " + parsed.course.title);
				}
			});

		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}
});

server.listen(8080);