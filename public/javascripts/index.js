$(document).ready(function() {

  // GLOBALS
  var dayPlans = [];
  var currentDay;

  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(40.705137, -74.007624)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  // LOAD DROP DOWN MENUS //
  function loadList(obj, selector) {
    return selector.append($("<option>" + obj.name + "</option>").data({obj:obj, marker:obj.marker})); 
  }

  function addMarker(obj) {
    obj.marker = new google.maps.Marker({
      position: new google.maps.LatLng(obj.place[0].location[0], obj.place[0].location[1]),
      title: obj.name,
      animation: google.maps.Animation.DROP
    });
    
  }

  all_hotels.forEach(function(hotel) {
    addMarker(hotel);
    var $selector = $("select[name='hotels']");
    loadList(hotel, $selector);
  });

  all_restaurants.forEach(function(restaurant) {
    addMarker(restaurant);
    var $selector = $('select[name=restaurants]');
    loadList(restaurant, $selector);
  });

  all_things_to_do.forEach(function(thing) {
    addMarker(thing);
    var $selector = $('select[name=things]');
    loadList(thing, $selector);
  });


  // ADD A DAY BUTTON FUNCTIONALITY //

  var addADay = function(id){

    // push new day object to dayPlans array

    $dayButton = 
      $("<button type='button' class='btn btn-default dayButton'>Day " + 
      ($('#daybtns').children().length + 1) + "</button>").data({'id':id}); 

    $dayButton.appendTo($("#daybtns")); 

    // $dayButton.on('click', function(event){
    //   currentDay = dayPlans[$(this).index()];
    //   renderDays(); 
      

}
  
  $(document).delegate('#daybtns', 'click', function(event){
   var $target = $(event.target);
   console.log($target) 
   var id = $target.data('id'); 
   console.log(id); 
   $('#daybtns > .btn-primary').removeClass('btn-primary'); 
   $target.addClass('btn-primary');
     var url = '/days/'+ id
     
     $.ajax({
      url: url,
      type: 'GET',
      data: '',
      dataType: 'json',
      success: function(day) {
        console.log(day)
        renderDay(day)
    }
  }); 
});

function buildItem(item){
  return '<li>' + item + '</li>'
}

function renderDay(day){

  console.log('day', day)
  console.log(day.thingsToDo)

  if (day.hotels !== undefined){
  $('#hotelsList').html(buildItem(day.hotel))    
  }

  if (day.thingsToDo !== []){
  $('#thingsList').append(day.thingsToDo.map(buildItem))    
  }

  if (day.restaurants !== []){
  $('restaurantsList').append(day.restaurants.map(buildItem))    
  }
}


  // $("#addDay").on('click', function(event){
  //   addADay(); 
  // })

  $('#addDay').on('click', function(event) {
    $.ajax({
      url: '/days',
      type: 'POST',
      data: '',
      dataType: 'json',
      success: function(day) {
        var id = day._id; 
        addADay(id) 
      }
    });
  });


  // })

  // on app start, run addADay
  // addADay(); 


  //     ADD REST/HOTEL/THING BUTTON      //

  $('.addButton').on('click', function(event){


    var dayId = $('#thisday').data(obj._id)
/*
    var selectedHotel = $('select[name="hotels"] :selected')
    var selectedThing = $('select[name="things"] :selected')
    var selectedRestaurant = $('select[name="restaurants"] :selected')

    if (this.id === 'things'){ 
      currentDay.thingsToDo.push(selectedThing.val());  
      selectedThing.data('marker').setMap(map);
      renderDays(); 
      }
    else if (this.id === 'hotels'){
      if (currentDay.hotel.length < 1){
        currentDay.hotel.push(selectedHotel.val());
        selectedHotel.data('marker').setMap(map);
        renderDays(); 
      } else {
        alert('You must remove a hotel to add one!')
      } 
    }
    else if (this.id === 'restaurants'){
      if (currentDay.restaurants.length < 3){
        currentDay.restaurants.push(selectedRestaurant.val()); 
        selectedRestaurant.data('marker').setMap(map);
        renderDays();      
      }
    }
  })
*/

  function writeVisitToServer(attraction_id, dayId, type_of_place) {
    var post_data = {
      attraction_id: attraction_id,
      attraction_type: type_of_place
    };

    var post_callback = function(responseData) {

    };

    $.post('/days/' + dayId + '/attractions', post_data, post_callback);
  }


  ////////////RENDER DAYS ////////////////////////

  delBtn = 
    "<button type='button' class='btn-xs btn-danger del'> x </button>";

  function renderDays(){

    $('#subhead').empty()
    $('#subhead').append('Day ', currentDay.dayNum)

    var hotelsList = '';
    if (currentDay.hotel.length > 0) {
      hotelsList += '<li>' + currentDay.hotel + delBtn + '</li>'
    }
    $('#hotelsList').html(function(){
      return hotelsList; 
    });
    var thingsToDo = ""; 
    currentDay.thingsToDo.forEach(function(thing){
      things = '<li>' + thing + delBtn + '</li>';
      thingsToDo += things; 
      $(things).append(delBtn)  
    });

    $('#thingsList').html(function(){
      return thingsToDo; 
    })

    var restaurants = ""; 
    currentDay.restaurants.forEach(function(restaurant){      
      restaurants += '<li>' + restaurant + delBtn + '</li>'; 
    }); 

    $('#restaurantsList').html(function(){
      return restaurants; 
    })
  }

  // DELETE ITEM HANDLER
  $('.this-plan').on('click', '.del', function(event){
    var $itemToRemove = $(this).closest('li'); 
    // delete item from currentDay array
    // currentDay.hotels.splice(selectedIndex, 1)
    if ($itemToRemove.parent().attr('id') === 'restaurantsList')
      removeRestaurant($itemToRemove);
    if ($itemToRemove.parent().attr('id') === 'hotelsList')
      removeHotel($itemToRemove);
    if ($itemToRemove.parent().attr('id') === 'thingsList')
      removeThing($itemToRemove);

    $itemToRemove.remove()
  }); 

  function removeHotel(hotel) {
    currentDay.hotel = [];
  }

  function removeRestaurant(restaurant) {
    currentDay.restaurants.splice(restaurant.index() , 1)
  }

  function removeThing(thing) {
    currentDay.thingsToDo.splice(thing.index() , 1)
  }

  // DELETE DAY HANDLER

  $('#deleteDay').on('click', function() {
    var deletedDay = currentDay;

    currentDay = dayPlans[deletedDay.dayNum-1]

    dayPlans.splice(deletedDay, 1);
    $('.dayButton').last().remove();

  })

});

});
