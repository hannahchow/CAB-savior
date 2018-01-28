var i = 1;
var avail_num = 1;
var old = 0;
// function myLoop () {
// 	chrome.notifications.create(null, {type: "basic",title: "LITTY",message: "werking", iconUrl: "icon.png"});
//    //  old = avail_num;
//    //  chrome.storage.sync.get('classPicked', function(items) {
//    //   if(items['classPicked'] != null) {
//    //    refreshData(items['classPicked'].code);
//    //   }
//    // });      
// }
chrome.alarms.onAlarm.addListener(function( alarm ) {
	// refreshData("CSCI 0160");
	chrome.notifications.create(null, {type: "basic",title: "LITTY",message: "werking", iconUrl: "icon.png"});
	 old = avail_num;
	 chrome.storage.sync.get('classPicked', function(items) {
	  if(items['classPicked'] != null) {
	   // refreshData(items['classPicked'].code);
	   chrome.runtime.sendMessage({code: items['classPicked'].code});
	  }
	});  
});
