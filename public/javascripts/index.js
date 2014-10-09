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
    event.preventDefault();
    console.log($(this).closest('.btn-group').find('#nameField').text());
   $(this).closest('.btn-group').find('#nameField').text($(this).text());
  });
 
// var days = [{'things': [], 'hotel': 'String', 'restaurants': [], day: num, markers: []}, {}, {}];

var dayPlans = [{
  //must start with day 1
  hotels: [], 
  thingsToDo: [], 
  restaurants: [], 
  dayNum: 1 
}];

var currentDay = dayPlans[0]; 

function AddADay(){

  var addedDay = {
    hotels: [], 
    thingsToDo: [], 
    restaurants: [], 
    dayNum: dayPlans.length + 1
  }

  var dayPlans.push(addedDay)

  
}


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


$('.addButton').on('click', function(event){
  var thing = $(this).closest('.btn-group.inline').find('#nameField').text();
  console.log('this things', thing); 
  if (this.id === 'things'){ 
        currentDay.thingsToDo.push(thing);
        renderDays(); 
        console.log(currentDay);    
    }
  else if (this.id === 'hotels'){
    if (currentDay.hotels.length < 1){
      currentDay.hotels.push(thing);
      renderDays(); 
      console.log(currentDay);
    } else {
      alert('You must remove a hotel to add one!')
      console.log(currentDay);
    } 
  }
  else if (this.id === 'restaurants'){
    if (currentDay.restaurants.length < 3){
      currentDay.restaurants.push(thing); 
      renderDays(); 
      console.log(currentDay);
    }
  }
});


// $(.removeButton).on('click', function(){})

$('#addDay').on('click', function(){ 
    addADay()
});


// $('.dayButton').on('click', function(){
//   event.preventDefault(); 
//   var header = 'Plan for ';
//     $('#header').text(header + $(this).text());


// });







});