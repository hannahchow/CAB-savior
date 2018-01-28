function populate(out) {
  document.getElementById('sections').innerHTML = "";
  document.getElementById("coursecode").innerHTML = out.code;

  if (out.overrideRequired == true){
    var html = `<i class="fa fa-exclamation-triangle"></i>`;
    document.getElementById("courseoverride").innerHTML = html + " Instructor override required";
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