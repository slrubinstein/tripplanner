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


  $(document).delegate('#daybtns', 'click', function(event){
   var $target = $(event.target);
   // console.log($target) 
   var id = $target.data('id'); 
   // console.log(id); 
   $('#daybtns > .btn-primary').removeClass('btn-primary'); 
   $target.addClass('btn-primary');
     var url = '/days/'+ id
     
     $.ajax({
      url: url,
      type: 'GET',
      data: '',
      dataType: 'json',
      success: function(day) {
        renderDay(day)
    }
  }); 
});

function buildItem(item){
  delBtn = 
    "<button type='button' class='btn-xs btn-danger del'> x </button>";

  return '<li>' + item.name + delBtn + '</li>'
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

// function renderDay(day){

//   if (day.hotels !== []){
//     $('#hotelsList').replaceWith($hotels.clone());
//     $('#hotelsList').append(day.hotels.map(buildItem))    
//   }

//   if (day.thingsToDo !== []){
//     $('#thingsList').replaceWith($things.clone()); 
//     $('#thingsList').append(day.thingsToDo.map(buildItem))
//   }

//   if (day.restaurants !== []){
//     $('#restaurantsList').replaceWith($restaurants.clone());
//     $('#restaurantsList').append(day.restaurants.map(buildItem));    
//   }
// }

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




  var addFirstDay = function() {
    $('#daybtns').children().eq(0).addClass('btn-primary'); 
  }

  $('#addDay').trigger('click', addFirstDay());


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
      success: function(day) {
        console.log('populate day: ', day)
        renderDay(day) 
    }
  });
}); 

  // DELETE ITEM HANDLER
  $('.this-plan').on('click', '.del', function(event){
    console.log('in delete')
    var $itemToRemove = $(this).closest('li'); 
    var itemData = $itemToRemove.data()
    console.log(itemData)
    var postdata = {}

    if ($itemToRemove.parent().attr('id') === 'restaurantsList'){
      postdata.type = 'restaurants'; 
      postdata.id = $itemToRemove.data("_id")
      removeRestaurant($itemToRemove);
    }
    else if ($itemToRemove.parent().attr('id') === 'hotelsList'){
      removeHotel($itemToRemove);

    }
    else if ($itemToRemove.parent().attr('id') === 'thingsList'){
      removeThing($itemToRemove);      
    }

    // delete item from currentDay array
    // currentDay.hotels.splice(selectedIndex, 1)
    // if ($itemToRemove.parent().attr('id') === 'restaurantsList')
    //   removeRestaurant($itemToRemove);

    // $itemToRemove.remove()

    
    $.ajax({
    url: '/days',
    type: 'POST',
    data: postdata,
    dataType: 'json',
    success: function(day) {
      renderDay(day) 
    }
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


    // var dayId = $('#thisday').data(obj._id)
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

  

  // function renderDays(){

  //   $('#subhead').empty()
  //   $('#subhead').append('Day ', currentDay.dayNum)

  //   var hotelsList = '';
  //   if (currentDay.hotel.length > 0) {
  //     hotelsList += '<li>' + currentDay.hotel + delBtn + '</li>'
  //   }
  //   $('#hotelsList').html(function(){
  //     return hotelsList; 
  //   });
  //   var thingsToDo = ""; 
  //   currentDay.thingsToDo.forEach(function(thing){
  //     things = '<li>' + thing + delBtn + '</li>';
  //     thingsToDo += things; 
  //     $(things).append(delBtn)  
  //   });

  //   $('#thingsList').html(function(){
  //     return thingsToDo; 
  //   })

  //   var restaurants = ""; 
  //   currentDay.restaurants.forEach(function(restaurant){      
  //     restaurants += '<li>' + restaurant + delBtn + '</li>'; 
  //   }); 

  //   $('#restaurantsList').html(function(){
  //     return restaurants; 
  //   })
  // }



  // // DELETE DAY HANDLER

  // $('#deleteDay').on('click', function() {
  //   var deletedDay = currentDay;

  //   currentDay = dayPlans[deletedDay.dayNum-1]

  //   dayPlans.splice(deletedDay, 1);
  //   $('.dayButton').last().remove();

  // });

});

// });
