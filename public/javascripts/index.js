

$(document).ready(function() {
// ADD A DAY BUTTON FUNCTIONALITY //

var dayPlans = [];
var currentDay;
// var markers = [[40.714985, -74.015841], [40.717873, -73.995231]]; 


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

  $dayButton = $("<button type='button' class='btn btn-default dayButton'>Day " + addedDay.dayNum + "</button>"); 

  $dayButton.appendTo($("#daybtns")); 

  $dayButton.on('click', function(event){
    currentDay = dayPlans[addedDay.dayNum - 1]; 
    renderDays(); 
    initialize_gmaps();

  }) 
}

  addADay(); 

  $("#addDay").on('click', function(event){
    addADay(); 
  })




//MAP FUNCTIONALITY 

//DROP MARKERS


var initialize_gmaps = function() {

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(40.705137, -74.007624)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

}

initialize_gmaps();


var update_gmaps = function() {

  var bounds = new google.maps.LatLngBounds();


  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(40.705137, -74.007624)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);


  currentDay.markers.forEach(function(m) {
    var myLatlng = new google.maps.LatLng(Number(m[0]), Number(m[1]));
  
    bounds.extend(myLatlng);

    // To add the marker to the map, use the 'map' property
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:"Hello World!"
    });

  });
  map.fitBounds(bounds);


}



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

 // var allMarkers = [];  


////////////RENDER DAYS ////////////////////////

$delBtn = $("<button type='button' class='btn-xs btn-danger dayButton del'> Delete + </button>");

function renderDays(){
  var hotelsList = ""; 
  currentDay.hotels.forEach(function(hotel){
    var thisHotel = '<li>' + hotel + '</li>'
    hotelsList += thisHotel; 
    console.log('hotels for each')
    });
    $delBtn.appendTo($('#hotelsList')); 
    $('#hotelsList').html(function(){
      return hotelsList; 

  });

   var thingsToDo = ""; 
   currentDay.thingsToDo.forEach(function(thing){
        console.log('things for each')
        things = '<li>' + thing + '</li>';
    thingsToDo += things; 
      $(things).append($delBtn)
    
   }); 
   $('#thingsList').html(function(){
    return thingsToDo; 
   })

   var restaurants = ""; 
   currentDay.restaurants.forEach(function(restaurant){
        console.log('restaurants for each')

    restaurants += '<li>' + restaurant + '</li>'; 
    // $(this).closest('li').append($delBtn)
   }); 
   $('#restaurantsList').html(function(){
    return restaurants; 
   })

   update_gmaps();
}



$delBtn.on('click', function(event){
    $(this).closest('li').remove(); 
}); 


//     ADD REST/HOTEL/THING BUTTON      //

$('.addButton').on('click', function(event){

  var selectedHotel = $('select[name="hotels"] :selected')
  var selectedThing = $('select[name="things"] :selected')
  var selectedRestaurant = $('select[name="restaurants"] :selected')

  var place;

  if (this.id === 'things'){ 
        currentDay.thingsToDo.push(selectedThing.val());
        currentDay.markers.push(selectedThing.attr('data-location').split(","))
        renderDays(); 
    }
  else if (this.id === 'hotels'){
    if (currentDay.hotels.length < 1){
      currentDay.hotels.push(selectedHotel.val());
      currentDay.markers.push(selectedHotel.attr('data-location').split(","))
      renderDays(); 

    } else {
      alert('You must remove a hotel to add one!')

    } 
  }
  else if (this.id === 'restaurants'){
    if (currentDay.restaurants.length < 3){
      currentDay.restaurants.push(selectedRestaurant.val()); 
      currentDay.markers.push(selectedRestaurant.attr('data-location').split(","));
      renderDays(); 
      
    }
  }
      update_gmaps();
})


  

});


