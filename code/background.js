/* ONLY WORKS FOR A SINGLE SECTION!!!!! */

var old = 1;
var avail_num = 0;
function myLoop () {
	window.setTimeout(function() {
		// chrome.notifications.create(null, {type: "basic",title: "LITTY",message: "werking", iconUrl: "icon.png"});
	   	 chrome.storage.sync.get('classPicked', function(items) {
	   	  if(items['classPicked'] != null) {
	   	  	var url = "http://10.38.58.25:8080/?course_code=" + items['classPicked'].code;
	   	   fetch(url)
	   	     .then(res => res.json())
	   	     .then((class_data) => {
	   	       chrome.storage.sync.set({'classPicked': class_data});
	   	       avail_num = class_data.sections[0].avail;
	   	       // chrome.notifications.create(null, {type: "basic",title: "No success",message: old+" a num "+avail_num, iconUrl: "icon.png"});
	   	       if (old <= 0 && avail_num > 0) {
	   	         chrome.notifications.create(null, {type: "basic",title: "Spaces available!",message: "A space has opened up in " + class_data.title, iconUrl: "icon.png"});
	   	         chrome.storage.sync.get('email', function(items) {
	   	       if(items['email'] != null) {
	   	         var url = "http://10.38.58.25:8080/?email=" + items['email'];
	   	         fetch(url);
	   	       }
	   	         });
	   	       }
	   	       old = avail_num;
	   	     })
	   	   myLoop();
			} 
		});
	},3000);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  old = 1;
});

myLoop();