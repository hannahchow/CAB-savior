function populate(out) {

  var warning = document.getElementById("error");

  if (out.error != null) {

    warning.style.display = "block";
    warning.children[1].innerHTML = out.error;
    Array.from(document.getElementsByClassName("separated")).forEach(function(item) {
      item.style.display = "none";
    });
    document.getElementById('register').style.display = "none";
  } else {
    Array.from(document.getElementsByClassName("separated")).forEach(function(item) {
      item.style.display = "block";
    });
    document.getElementById('register').style.display = "block";
    warning.style.display = "none";

  document.getElementById('sections').innerHTML = "";
  document.getElementById("coursecode").innerHTML = out.code;

  var override = document.getElementById("courseoverride");
  if (out.overrideRequired == true){
    override.style.display = "block";
  } else {
    override.style.display = "none";
  }
  document.getElementById("classname").innerHTML = out.title;


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
      </div>`;
      document.getElementById('sections').innerHTML = document.getElementById('sections').innerHTML + html;

  });
  // document.getElementById('classcontainer').innerHTML = document.getElementById('classcontainer').innerHTML + '<a href="https://cab.brown.edu/" target="_blank" id="register">REGISTER FOR COURSE</a>';
  document.getElementById("container").style.display = "block";
 }
}

window.onload = function() {

  var ele = document.getElementById('course-finder');
  chrome.storage.sync.get('classPicked', function(items) {
     if(items['classPicked'] != null) {
       populate(items['classPicked']);
     }
   });
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