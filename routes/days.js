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
		res.json(day)
	});
});

// router.post('/:dayId/attractions', function(req, res) {
// // add attraction to day
// 	Day.findById(req.params.dayId, function(err, day) {

// 		if (req.body.type === 'hotels') {
// 			Hotel.findById(req.body.id, function(err, hotel) {
// 				day['hotels'].push(hotel);
// 				day.save(function(err, day){
// 					res.json(day)
// 				})
// 			})

// 		} else if (req.body.type === 'restaurants') {
// 			Restaurant.findById(req.body.id, function(err, restaurant) {
// 				day['restaurants'].push(restaurant); 
// 				day.save(function(err, day){
// 					res.json(day)
// 				})
// 			})

// 		} else {
// 			ThingsToDo.findById(req.body.id, function(err, thing) {
// 				day['thingsToDo'].push(thing)			
// 				day.save(function(err, day){
// 					res.json(day)
// 				})
// 			})
// 		}
// 	})
// 	// res.json('index', day);
// });

router.post('/:dayId/attractions', function(req, res){
	Day.findById(req.params.dayId, function(err, day){
		if (req.body.type === 'hotels'){
			day['hotels'].push(req.body.id)
			day.save()
		}

		else if (req.body.type === 'restaurants'){
			day['restaurants'].push(req.body.id)
			day.save()
		}
		
		else {
			day['thingsToDo'].push(req.body.id)
			day.save()
		}
		day.populate('hotels restaurants thingsToDo', function(err, newDay) {
			res.json(newDay);
		})
		// res.json(day.populate('Hotels'));
		// res.json(day);
		// }).populate('Hotels Restaurant ThingsToDo')
})
});

router.get('/:dayId', function(req, res) {
	Day.findById(req.params.dayId, function(err, day){
		day.populate('Hotels Restaurant ThingsToDo');
		res.json(day);
	});
});

// router.get('/', function(req, res){
// 	Day.find(function(err, days){
// 		res.json(days);
// 	})
// })


router.get('/', function(req, res){
	Day.find(function(err, days){
		console.log(days)
			res.json(days)
	});
});



module.exports = router;