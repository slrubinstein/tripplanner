
//   console.log('document is ready');
// // $('.dropdown-toggle li a').on('click', function(event){
// //     console.log('happy days')
// //     event.preventDefault(); 
// //     $(this).addClass('selected'); 
// //     $(this).parent.text($(this).text())   
// // })






// function initialize() {
//  var mapOptions = {
//    zoom: 8,
//    center: new google.maps.LatLng(-34.397, 150.644)
//  };

//  var map = new google.maps.Map(document.getElementById('map-canvas'),
//      mapOptions);
// }

// function loadScript() {
//  var script = document.createElement('script');
//  script.type = 'text/javascript';
//  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
//      'callback=initialize';
//  document.body.appendChild(script);
// }

// window.onload = loadScript;



function initialize_gmaps() {
 
  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(40.705786,-74.007672);
 
  // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 12
  };
 
  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById("map-canvas");
 
  // initialize a new Google Map with the options
  var map = new google.maps.Map(map_canvas_obj, mapOptions);
 
  // Add the marker to the map
  var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
  });
 
  // Add the marker to the map by calling setMap()
  marker.setMap(map);
}

$(document).ready(function() {
  console.log('document is ready');
  initialize_gmaps();

 $(".dropdown-menu li a").click(function(event){
  console.log('clicked');
    event.preventDefault();
   $(this).closest('.btn-group').find('#nameField').text($(this).text());
  });
}); 