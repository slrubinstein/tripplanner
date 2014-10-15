$(document).ready(function() {

  $.ajax({
    url: '/days',
    type: 'GET',
    data: '',
    dataType: 'json',
    success: function(days) {
      renderAllDay(days) 
    }
  })

  function renderAllDay(days){
    days.forEach(function(day) {
      addADay(day._id)
    })
  }

  // GLOBALS
  var dayPlans = [];
  var currentDay;
  var $things = $('#thingsList').clone();
  var $hotels = $('#hotelsList').clone();
  var $restaurants = $('#restaurantsList').clone();
  var $daybtns = $('#daybtns').clone(); 

  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(40.705137, -74.007624)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  // LOAD DROP DOWN MENUS //
  function loadList(obj, selector) {
    return selector.append($("<option>" + obj.name + "</option>").data(obj)); 
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
    var $selector = $("select[name='restaurants']");
    loadList(restaurant, $selector);
  });

  all_things_to_do.forEach(function(thing) {
    addMarker(thing);
    var $selector = $("select[name='things']");
    loadList(thing, $selector);
  });


  // ADD A DAY BUTTON FUNCTIONALITY //

// iterate through this addADay for each day, passing in day's id

  var addADay = function(id){
    $dayButton = 
      $("<button type='button' class='btn btn-default dayButton'>Day " + 
      ($('#daybtns').children().length + 1) + "</button>").data({'id':id}); 

    $dayButton.appendTo($("#daybtns")); 
  }

var reNumberDays = function(days){

  $('#daybtns').replaceWith($daybtns.clone()) 

  days.forEach(function(day){
    $dayButton = $("<button type='button' class='btn btn-default dayButton'>Day " + 
      ($('#daybtns').children().length + 1) + "</button>").data({'id': day._id}); 

    $dayButton.appendTo($("#daybtns"));
    
  })

  days.forEach(function(day){
    renderDay(day)
  })
}


  $(document).delegate('#daybtns', 'click', function(event){
    // console.log('in event')
    var $target = $(event.target);
    var dayId = $target.data('id'); 
    // console.log('dayId', dayId)
   $('#daybtns > .btn-primary').removeClass('btn-primary'); 
   $target.addClass('btn-primary');

    var url = '/days/'+ dayId;
   // console.log(dayId); 
     
     $.ajax({
      url: url,
      type: 'GET',
      data: '',
      dataType: 'json',
      success: function(newDay) {
        // console.log('after click', newDay)
        renderDay(newDay)
    }
  });
});

function buildItem(item){
  var delBtn = 
    "<button type='button' class='btn-xs btn-danger del'> x </button>";

  return $('<li>' + item.name + delBtn + '</li>').data(item);
}

function renderDay(day){

  if (day.hotels !== []){
    $('#hotelsList').replaceWith($hotels.clone());
    $('#hotelsList').append(day.hotels.map(buildItem))    
  }

  if (day.thingsToDo !== []){
    $('#thingsList').replaceWith($things.clone()); 
    $('#thingsList').append(day.thingsToDo.map(buildItem))
  }

  if (day.restaurants !== []){
    $('#restaurantsList').replaceWith($restaurants.clone());
    $('#restaurantsList').append(day.restaurants.map(buildItem));    
  }
}


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


  // DELETE DAY HANDLER

  $('#deleteDay').on('click', function() {
    console.log('in event')
    var dayId = $('#daybtns > .btn-primary').data('id')
      console.log(dayId)
     $.ajax({
      url: '/days/' + dayId + '/deleteDay',
      type: 'POST',
      data: '',
      dataType: 'json',
      success: function(days) {
        reNumberDays(days);  
      }
    });

  });


  // addFirstDay = function() {
  //   setTimeout($('#daybtns').children().eq(0).addClass('btn-primary'), 0);
  //   $('#addDay').trigger('click');
  // }

  // if ($('#daybtns').children().length === 0) {
  //   console.log('executing because ' + $('#daybtns').children().length + ' equals 0')
  //   addFirstDay();
  // }


  //     ADD REST/HOTEL/THING BUTTON      //

  $('.addButton').on('click', function(event){
    var dayId = $('#daybtns > .btn-primary').data('id')
    var url = '/days/' + dayId + '/attractions'; 
    var data = {}; 

    if (this.id === 'things'){ 
      data.name = $("select[name='things'] :selected").data("name");
      data.id = $("select[name='things'] :selected").data("_id");
      data.type = 'thingsToDo'; 
    }

    else if (this.id === 'hotels'){ 
      data.name = $("select[name='hotels'] :selected").data("name"); 
      data.id = $("select[name='hotels'] :selected").data("_id");
      data.type = 'hotels';
    }

    else if (this.id === 'restaurants'){ 
      data.name = $("select[name='restaurants'] :selected").data("name")
      data.id = $("select[name='restaurants'] :selected").data("_id");
      data.type = 'restaurants';
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(newDay) {
        // console.log('populate day: ', newDay)
        renderDay(newDay) 
      }
    });
  }); 

  // DELETE ITEM HANDLER
  $('.this-plan').on('click', '.del', function(event){
    var $target = $(event.target)
    var dayId = $('#daybtns > .btn-primary').data('id')
    var postdata = {};
    var url = '/days/' + dayId + '/delete'

    if ($target.closest('ul').attr('id') === 'restaurantsList'){
      postdata.type = 'restaurants'; 
      postdata.id = $target.closest('li').data("_id")
    }
    else if ($target.closest('ul').attr('id') === 'hotelsList'){
      postdata.type = 'hotels'; 
      postdata.id = $target.closest('li').data("_id")
    }
    else if ($target.closest('ul').attr('id') === 'thingsList'){
      // console.log('in things')
      postdata.type = 'things'; 
      postdata.id = $target.closest('li').data("_id")
    }

    $.ajax({
    url: url,
    type: 'POST',
    data: postdata,
    dataType: 'json',
    success: function(newDay) {
      // console.log('DAY RETURNED', newDay)
      renderDay(newDay) 
    }
  }); 
}); 



  function writeVisitToServer(attraction_id, dayId, type_of_place) {
    var post_data = {
      attraction_id: attraction_id,
      attraction_type: type_of_place
    };

    var post_callback = function(responseData) {

    };

    $.post('/days/' + dayId + '/attractions', post_data, post_callback);
  }


  


});