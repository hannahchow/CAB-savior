/**
 * This function propagates the HTML with appropriate information depending on the user's search.
 */
function populate(out) {

  var warning = document.getElementById("error");

  if (out.error != null) {

    // Shows error and hides everything else.
    warning.style.display = "block";
    warning.children[1].innerHTML = out.error;
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
  document.getElementById("coursecode").innerHTML = out.code;
  document.getElementById("classname").innerHTML = out.title;

  // Shows override warning if appropriate.
  var override = document.getElementById("courseoverride");
  if (out.overrideRequired == true){
    override.style.display = "block";
  } else {
    override.style.display = "none";
  }

  // Makes an HTML block for each section, giving each its appropriate information.
  out.sections.forEach(function(section){
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

window.onload = function() {
  // If data previously fetched, propagates from local storage.
  chrome.storage.sync.get('classPicked', function(items) {
     if(items['classPicked'] != null) {
       populate(items['classPicked']);
     }
   });

  // Gets data from user's search
  var ele = document.getElementById('course-finder');
  ele.onsubmit = function() {
    var url = "http://10.38.58.25:8080/?course_code=" + document.getElementById('search').value;
    fetch(url)
    .then(res => res.json())
    .then((out) => {
      populate(out);
      chrome.storage.sync.set({'classPicked': out}, function() {
        console.log("we saved");
      });
    })
    .catch(err => { throw err });
    return false;
  }

}