var old = [];
var avail_num = [];
function myLoop () {
	window.setTimeout(function() {
	   	 chrome.storage.sync.get('classPicked', function(items) {
	   	  if(items['classPicked'] != null) {
	   	  	var url = "http://localhost:8080/?course_code=" + items['classPicked'].code;
	   	   fetch(url)
	   	     .then(res => res.json())
	   	     .then((class_data) => {
	   	       chrome.storage.sync.set({'classPicked': class_data});
	   	       avail_num = class_data.sections.map(x => x['avail']);
	   	       if (old.length != 0) {
	   	       	for(var i=0; i < avail_num.length; i++) {
	   	       		if(old[i] <= 0 && avail_num[i] > 0) {
			   	        chrome.notifications.create(null, {type: "basic",title: "Spaces available!",message: "A space has opened up in " + class_data.title, iconUrl: "icon.png"});
			   	        chrome.storage.sync.get(['email', 'classPicked'], function(items) {
				   	        if(items['email'] != null) {
					   	        var url = "https://cab-savior.herokuapp.com/?email=" + items['email'] + "&course_code=" + items['classPicked'].code;
					   	        fetch(url);
				   	        }
			   	        });
			   	        break;
	   	       		}
	   	       	}
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

chrome.runtime.onConnect.addListener(function(request, sender, sendResponse) {
  old = [];
});

myLoop();