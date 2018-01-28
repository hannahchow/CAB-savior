var i = 1;
var avail = 0;
var old = 0;

function myLoop () {      
   setTimeout(function () {
    old = avail;
    chrome.storage.sync.get('classPicked', function(items) {
     if(items['classPicked'] != null) {
      console.log(refreshData());
       avail = refreshData()[0].avail;
     }
   });
      if (old <= 0 && avail > 0) {           
        console.log("BOOYAH");
      } else {
        myLoop(); 
      }                      
   }, 3000)
}

myLoop();
