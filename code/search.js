// var old = 1;
// var avail_num = 0;
/**
 * This function propagates the HTML with appropriate information depending on the user's search.
 */
function populate(class_data) {

  var warning = document.getElementById("error");

  if (class_data.error != null) {

    // Shows error and hides everything else.
    warning.style.display = "block";
    document.getElementById("container").style.display = "block";
    warning.children[1].innerHTML = class_data.error;
    Array.from(document.getElementsByClassName("separated")).forEach(function(item) {
      item.style.display = "none";
    });
    document.getElementById('register').style.display = "none";
  } else {
    // Hides error and shows everything else.
    warning.style.display = "none";
    Array.from(document.getElementsByClassName("separated")).forEach(function(item) {
      item.style.display = "block";
    });
    document.getElementById('register').style.display = "block";

  // Clear sections so repeated requests don't add on to the old list.
  document.getElementById('sections').innerHTML = "";

  // Inserts some data.
  document.getElementById("coursecode").innerHTML = class_data.code;
  document.getElementById("classname").innerHTML = class_data.title;

  // Shows override warning if appropriate.
  var override = document.getElementById("courseoverride");
  if (class_data.overrideRequired == true){
    override.style.display = "block";
  } else {
    override.style.display = "none";
  }

  // Makes an HTML block for each section, giving each its appropriate information.
  class_data.sections.forEach(function(section){
    var classsize = 0;
    var classavail = 0;

    if (section.capacity == "") {
    classsize = "uncapped";
    classavail = "uncapped";
  } else {
   classsize = section.capacity;
   classavail = section.avail;
  }

    var html = `<div style="display: block;" class="separated"> 
        <div class="space">
        <label>CLASS SECTION:</label>
        <div class="values">${section.no}</div>
      </div>
      <div>
        <label>TOTAL CLASS SIZE:</label>
        <div class="values">${classsize}</div>
      </div>
      <div>
         <label>SEATS AVAILABLE:</label>
        <div class="values">${classavail}</div>
      </div>
      ${section.meet}
      </div>`;
      document.getElementById('sections').innerHTML = document.getElementById('sections').innerHTML + html;

  });
  // Show the hidden block (initially, only the search bar is visible).
  document.getElementById("container").style.display = "block";
 }
}

var class_data;

function refreshData(code) {
  var url = "https://cab-savior.herokuapp.com/?course_code=" + code;
  return fetch(url)
  .then(res => res.json())
  .then((class_data) => {
    populate(class_data);
    chrome.storage.sync.set({'classPicked': class_data});
    // avail_num = class_data.sections[0].avail;
    // // chrome.notifications.create(null, {type: "basic",title: "No success",message: old+" a num "+avail_num, iconUrl: "icon.png"});
    // if (old <= 0 && avail_num > 0) {
    //   chrome.notifications.create(null, {type: "basic",title: "Real success",message: "werking", iconUrl: "icon.png"});
    //   chrome.storage.sync.get('email', function(items) {
    // if(items['email'] != null) {
    //   var url = "http://10.38.58.25:8080/?email=" + items['email'];
    //   fetch(url);
    // }
    //   });
    // }
    // old = avail_num;
  })
  .catch(err => { throw err });
}

window.onload = function() {
  chrome.alarms.create("checker", {periodInMinutes: 1});
  // If data previously fetched, propagates from local storage.
  chrome.storage.sync.get('classPicked', function(items) {
     if(items['classPicked'] != null) {
       populate(items['classPicked']);
     }
   });

  // Gets data from user's search
  var ele = document.getElementById('course-finder');
  var button = document.getElementById('register');
  var classcontainer = document.getElementById('classcontainer');
  var container = document.getElementById('container');
  var emailcont = document.getElementById('email-container');
  var email_close = document.getElementById('email-close');
  ele.onsubmit = function() {
    chrome.runtime.sendMessage({new_course: true});
    refreshData(document.getElementById('search').value);
    return false;
  };

  var close = document.getElementById('close-class');
  close.onclick = function() {
    container.style.display = "none";
    chrome.storage.sync.clear();
  }

  button.onclick = function() {
    emailcont.style.display = "inline";
    classcontainer.style.height = "370px";
    container.style.height = "400px";

  }
  document.getElementById('email-form').onsubmit = function() {
    chrome.storage.sync.set({'email': document.getElementById('email').value});
    document.getElementById('email-container').style.display = "none";
    document.getElementById('email-filled').innerHTML = document.getElementById('email').value + "<span id='email-close'>&times;</span>";
    email_close.style.display = "inline";
    document.getElementById('register').style.display = "none";
    return false;
  };

  document.getElementById('')
}

