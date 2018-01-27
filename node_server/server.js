var http = require('http');
var https = require('https');
const { URL, URLSearchParams } = require('url');
var email = require("emailjs");

// TODO: Fix this send email function.
send_email => {
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

get_term_code => {
	var code = "";
	var time = new Date();
	if (time.getMonth() == 11 && time.getDate() > 15) {
		code += time.getYear().toString() + "15";
	} else if (time.getMonth() < 4) {
		code += (time.getYear()-1).toString() + "20";
	} else if (time.getMonth() < 7 && time.getMonth() >= 4) {
		code += time.getYear().toString() + "00";
	} else if (time.getMonth() >= 7) {
		code += time.getYear().toString() + "10";
	}

	return code;
}

// Sets up the node server.
var server = http.createServer(function(req, res) {
	// Gets parameters from url and checks if there is one for course code.
	var code = "";
	var params = new URLSearchParams(req.url.substr(2));
	// Iterates to search for course_code.
	for (const [name, value] of params) {
	  if(name == "course_code") {
	  	code = value;
	  }
	}

	// The JSON data returned by the server.
	var returnData = {};

	// Error if no course code.
	if(code == "") {
		res.writeHead(400);
		returnData['error'] = "Course code not supplied";
		res.end(JSON.stringify(returnData));
	} else {
		// Gets data from that course code!
		https.get('https://cab.brown.edu/asoc-api/?output=json&page=asoc.rjs&route=course&term=201720&course=' + code, (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			data += chunk;
			});

			// The whole response has been received.
			resp.on('end', () => {
				// Success.
				res.writeHead(200);

				var parsed = JSON.parse(data);
				// Checks if API returned error.
				if(parsed['error'] != null) {
					returnData['error'] = "Course not found";
				} else {
					returnData['title'] = parsed.course.title;
					returnData['sections'] = [];
					parsed.sections.forEach(function(section, i){
						if(!section.cncld) {
							returnData['sections'][i] = {};
							returnData['sections'][i]['no'] = section.no;
							returnData['sections'][i]['capacity'] = section.capacity;
							returnData['sections'][i]['avail'] = section.avail;
						}
					});
				}
				res.end(JSON.stringify(returnData));
			});

		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}
});

server.listen(8080);