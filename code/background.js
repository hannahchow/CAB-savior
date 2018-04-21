/* ONLY WORKS FOR A SINGLE SECTION!!!!! */

var old = 1;
var avail_num = 0;
function myLoop () {
	window.setTimeout(function() {
	   	 chrome.storage.sync.get('classPicked', function(items) {
	   	  if(items['classPicked'] != null) {
	   	  	var url = "https://cab-savior.herokuapp.com/?course_code=" + items['classPicked'].code;
	   	   fetch(url)
	   	     .then(res => res.json())
	   	     .then((class_data) => {
	   	       chrome.storage.sync.set({'classPicked': class_data});
	   	       avail_num = class_data.sections[0].avail;
	   	       if (old <= 0 && avail_num > 0) {
	   	         chrome.notifications.create(null, {type: "basic",title: "Spaces available!",message: "A space has opened up in " + class_data.title, iconUrl: "icon.png"});
	   	         chrome.storage.sync.get(['email', 'classPicked'], function(items) {
		   	       if(items['email'] != null) {
		   	         var url = "https://cab-savior.herokuapp.com/?email=" + items['email'] + "&course_code=" + items['classPicked'].code;
		   	         fetch(url);
		   	       }
	   	         });
	   	       }
	   	       old = avail_num;
	   	     })
	   	     .catch(function(error) {
	   	     	console.log(error);
	   	     })
	   	   myLoop();
			} 
		});
	},1000 * 3);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  old = 1;
});

myLoop();