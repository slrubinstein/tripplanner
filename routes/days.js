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
	Day.create({}, function(err, day) {
		res.json(day)
	});
});

router.post('/:dayId/deleteDay', function(req, res){
	Day.findByIdAndRemove(req.params.dayId, function(err, day){
		Day.find(function(err, days){
			res.json(days);
		})
	})
})


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
		day.save(function(err) {
			day.populate('hotels restaurants thingsToDo', function(err, newDay) {
				res.json(newDay);
			});
		});	
	})
});

router.get('/:dayId', function(req, res) {
	Day.findById(req.params.dayId, function(err, day){
		day.populate('hotels restaurants thingsToDo', function(err, newDay){
			res.json(newDay);			
		});
	});
});

router.post('/:dayId/delete', function(req, res){
	var index; 
	Day.findById(req.params.dayId, function(err, day){
		if (req.body.type === 'restaurants'){
			index = day.restaurants.indexOf(req.body.id)
			console.log('index: ', day.restaurants.indexOf(req.body.id))
			day.restaurants.splice(index, 1)
			day.save();
		} else if (req.body.type === 'hotels'){
			index = day.hotels.indexOf(req.body.id)
			day.hotels.splice(index, 1)
			day.save();
		} else if (req.body.type === 'things'){
			console.log('things type', req.body.type)
			index = day.thingsToDo.indexOf(req.body.id)
			day.thingsToDo.splice(index, 1)
			day.save();
		}
		day.save(function(err){
			day.populate('hotels restaurants thingsToDo', function(err, newDay){
				res.json(newDay);
			})
		}); 
	});  
});


router.get('/', function(req, res){
	Day.find(function(err, days){
		console.log(days)
			res.json(days)
	});
});



module.exports = router;