var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var ThingsToDo = models.ThingsToDo;
var Restaurant = models.Restaurant; 


router.get('/', function(req, res) {
  Hotel.find(function(err, hotels) {
  	ThingsToDo.find(function(err, things){
  		Restaurant.find(function(err, restaurants){
		    res.render('index', { 
						hotels: hotels, 
						restaurants: restaurants, 
						things: things,
						title: "Trip Planner",
						each_place: hotels.place
    		});
  		});
  	});
  });
});


/*
router.get('/', 
	function(req, res, next) {
		Hotel.find(function(err, results) {
			req.body.hotels = results;
			next();
		});
	},
	function(req, res, next) {
		ThingsToDo.find(function(err, results) {
			req.body.thingsToDo = results;
			next();
		});
	},
	function(req, res, next) {
		Restaurants.find(function(err, results) {
			req.body.restaurants = results;
			next();
		});
	},
	function(req. res. next) {
		res.render...
	})
*/


router.get('/about', function(req, res) {
	res.render('about', {
		title: 'About Trip Planner'
	});
});

router.get('/contact', function(req, res) {
	res.render('contact', {
		title: 'Contact Trip Planner'
	});
});

module.exports = router;
