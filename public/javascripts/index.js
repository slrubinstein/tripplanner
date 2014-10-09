

$(document).ready(function() {
// ADD A DAY BUTTON FUNCTIONALITY //

var dayPlans = [];
var currentDay;
var markers = [[40.714985, -74.015841], [40.717873, -73.995231]]; 
initialize_gmaps();

var addADay = function(){

  var addedDay = {
    hotels: [], 
    thingsToDo: [], 
    restaurants: [], 
    markers: [], 
    dayNum: dayPlans.length + 1
  }

  dayPlans.push(addedDay);
  currentDay = dayPlans[addedDay.dayNum - 1]; 
  // console.log('these are day plans', dayPlans); 
  console.log('this is current day before daybutton', currentDay); 
  console.log('autoescape script:   ', all_hotels)

  $dayButton = $("<button type='button' class='btn btn-default dayButton'>Day " + addedDay.dayNum + "</button>"); 
  // console.log(addedDay.dayNum); 
  $dayButton.appendTo($("#daybtns")); 
  $dayButton.on('click', function(event){
    currentDay = dayPlans[addedDay.dayNum - 1]; 
    console.log('new current day', currentDay); 
    renderDays(); 

  }) 
}

  addADay(); 

  $("#addDay").on('click', function(event){
    addADay(); 
  })


//MAP FUNCTIONALITY 

//DROP MARKERS




function initialize_gmaps() {
   var myOptions = {
       mapTypeId: google.maps.MapTypeId.ROADMAP,
       mapTypeControl: false
   };
   var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
   var infowindow = new google.maps.InfoWindow(); 
   var marker, i;
   var bounds = new google.maps.LatLngBounds();

  console.log('element 1', element[0])
    console.log('element 2', element[1])
    console.log('in the map');

   for (i = 0; i < markers.length; i++) { 
       var pos = new google.maps.LatLng(Number(element[0]), Number(element[1]));
       bounds.extend(pos);
       marker = new google.maps.Marker({
           position: pos,
           map: map
       });
       google.maps.event.addListener(marker, 'click', (function(marker, i) {
           return function() {
               infowindow.setContent(marker(element[0]));
               infowindow.open(map, marker);
           }
        })
   )(marker, i);
   map.fitBounds(bounds);
 }
}
// function initialize_gmaps(){

//   var latlng = new google.maps.LatLng(40.705137, -74.013940);
//    var myOptions = {
//        zoom: 10,
//        center: latlng,
//        mapTypeId: google.maps.MapTypeId.ROADMAP,
//        mapTypeControl: false
//    };

//   var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
//   var infowindow = new google.maps.InfoWindow(); 
//   var marker, i;
//   var bounds = new google.maps.LatLngBounds();
  
//   for (var i = 0; i < markers.length; i++){
//     marker = new google.maps.Marker({
//       position: new google.maps.LatLng(Number(element[0]), Number(element[1])),
//       map: map
//     });
//     console.log('element 1', element[0])
//     console.log('element 2', element[1])
//     console.log('in the map');

//     google.maps.event.addListener(marker, 'click', (function(marker, i) {
//       return function() {
//        infowindow.setContent(markers[i][0]);
//        infowindow.open(map, marker);
//       }
//     } 
//   })(marker, i)); 
//   map.fitBounds(bounds); 
// }
    // var map_canvas_obj = document.getElementById("map-canvas");
    // var map = new google.maps.Map(map_canvas_obj, mapOptions);

    // var marker = new google.maps.Marker({
    //   position: myLatlng,
    //   title:"Hello World!"
    // });
   
    // function setMap(map) {
    //  for (var i=0; i < markers.length; i++) {
    //    markers[i].setMap(map);
    //  }
    // }
//     // setMap(map);
//   })
// }











 // LOAD DROP DOWN MENUS //
function loadList(obj, selector) {
  return selector.append($("<option data-location='"+obj.place[0].location+"'>" + obj.name + "</option>")); 
}

all_hotels.forEach(function(hotel) {
  var $selector = $("select[name='hotels']")
  loadList(hotel, $selector)
})

all_restaurants.forEach(function(restaurant) {
  var $selector = $('select[name=restaurants]')
  loadList(restaurant, $selector)
})

all_things_to_do.forEach(function(thing) {
  var $selector = $('select[name=things]')
  loadList(thing, $selector)
})

 var allMarkers = [];  


////////////RENDER DAYS ////////////////////////

function renderDays(){

  var hotelsList = ""; 
  currentDay.hotels.forEach(function(hotel){
    hotelsList += '<li>' + hotel + '</li>'; 
    });
    $('#hotelsList').html(function(){
      return hotelsList; 
  });

   var thingsToDo = ""; 
   currentDay.thingsToDo.forEach(function(thing){
    thingsToDo += '<li>' + thing + '</li>'; 
   }); 
   $('#thingsList').html(function(){
    return thingsToDo; 
   })

   var restaurants = ""; 
   currentDay.restaurants.forEach(function(restaurant){
    restaurants += '<li>' + restaurant + '</li>'; 
   }); 
   $('#restaurantsList').html(function(){
    return restaurants; 
   })
}




//     ADD REST/HOTEL/THING BUTTON      //

$('.addButton').on('click', function(event){

  var selectedHotel = $('select[name="hotels"] :selected')
  var selectedThing = $('select[name="things"] :selected')
  var selectedRestaurant = $('select[name="restaurants"] :selected')

  var place;

  if (this.id === 'things'){ 
        currentDay.thingsToDo.push(selectedThing.val());
        currentDay.markers.push(selectedThing.attr('data-location'))
        renderDays(); 
        console.log(currentDay); 
    }
  else if (this.id === 'hotels'){
    if (currentDay.hotels.length < 1){
      currentDay.hotels.push(selectedHotel.val());
      currentDay.markers.push((selectedHotel.attr('data-location').split(",")))
      console.log(currentDay.markers);
      renderDays(); 
      console.log(currentDay);
    } else {
      alert('You must remove a hotel to add one!')
      console.log(currentDay);
    } 
  }
  else if (this.id === 'restaurants'){
    if (currentDay.restaurants.length < 3){
      currentDay.restaurants.push(selectedRestaurant.val()); 
      currentDay.markers.push(selectedRestaurant.attr('data-location'));
      renderDays(); 
      console.log(currentDay);
    }
  }
})


  

});


