function populate(out) {
  document.getElementById("coursecode").innerHTML = out.code;
  document.getElementById("classname").innerHTML = out.title;
  document.getElementById("classsection").innerHTML = out.sections[0].no;

  
  if (out.sections[0].capacity == "") {
    document.getElementById("classsize").innerHTML = "uncapped";
    document.getElementById("classavail").innerHTML = "uncapped";
  } else {
    document.getElementById("classsize").innerHTML = out.sections[0].capacity;
    document.getElementById("classavail").innerHTML = out.sections[0].avail;
  }

  document.getElementById("container").style.display = "block";
}

window.onload = function() {

  var ele = document.getElementById('course-finder');
  // chrome.storage.sync.get('classPicked', function(items) {
  //   console.log(items);
  // });
  ele.onsubmit = function() {
    var url = "http://10.38.58.25:8080/?course_code=" + document.getElementById('search').value;
    fetch(url)
    .then(res => res.json())
    .then((out) => {
      // chrome.storage.sync.clear();
      // console.log('Checkout this JSON! ', out);
      populate(out);
      // chrome.storage.sync.set({'classPicked': out}, function() {
      //   console.log("we saved");
      // });
    })
    .catch(err => { throw err });
    return false;
  }

}