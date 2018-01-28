var i = 1;
var avail_num = 0;
var old = 0;

function myLoop () {      
   setTimeout(function () {
    old = avail_num;
    chrome.storage.sync.get('classPicked', function(items) {
     if(items['classPicked'] != null) {
      refreshData(items['classPicked'].code).then((sections) => {
      	avail_num = sections[0].avail;
      	if (old <= 0 && avail_num > 0) {           
      	  console.log("BOOYAH");
      	} else {
      	  myLoop(); 
      	}
      });
     }
   });                      
   }, 3000);
}
