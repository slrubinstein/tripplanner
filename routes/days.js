var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var ThingsToDo = models.ThingsToDo;
var Restaurant = models.Restaurant;
var Day = models.Day;


// why use res.json instead of res.send?

router.post('/', function(req, res) {
// create a day
	console.log('create new day post')
	Day.create({}, function(err, day) {
		console.log(day)
		res.json('index', day)
	});

});

router.post('/:dayId/attractions', function(req, res) {
// add attraction to day
	var dayId = req.params.dayId;
	Day.FindById(dayId, function(err, day) {
		var thisDay = day;

		if (post_data.attraction_type === 'hotel') {
			Hotel.FindById(post_data.attraction_id, function(err, hotel) {
				thisDay = ({
					'hotel': hotel
				})
			})

		} else if (post_data.attraction_type === 'restaurant') {
			Restaurant.FindById(post_data.attraction_id, function(err, restaurant) {
				thisDay = ({
					'restaurant': restaurant
				})
			})
		} else {
			ThingsToDo.FindById(post_data.attraction_id, function(err, thing) {
				thisDay = ({
					'thingsToDo': thing
				})
			})
		}
	})
	thisDay.save() 
	res.redirect('/');

});

router.get('/:dayId', function(req, res) {
	Day.findById(req.params.dayId, function(err, day){
		console.log(req.params.dayId); 
		console.log(day)
		res.json(day)
	});
});

module.exports = router;