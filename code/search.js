window.onload = function() {

  var ele = document.getElementById('course-finder');
  ele.onsubmit = function() {
    var url = "http://10.38.58.25:8080/?course_code=" + document.getElementById('search').value;
    // alert(url);
    console.log(url);
    fetch(url)
    .then(res => res.json())
    .then((out) => {
      console.log('Checkout this JSON! ', out);
    })
    .catch(err => { throw err });
  }
}