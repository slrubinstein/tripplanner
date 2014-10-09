var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripplanner');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Place, Hotel, ThingsToDo, Restaurant, Day;
var Schema = mongoose.Schema;

var placeSchema = new Schema({
	address: String,
	city: String,
	state: String,
	phone: String,
	location: [Number, Number]
});

var hotelSchema = new Schema({
	name: String,
	place: [placeSchema],
	num_stars: Number,
	amenities: String, 
	listHistory: [], 
});

var thingsToDoSchema = new Schema({
	name: String,
	place: [placeSchema],
	age_range: String
});

var restaurantSchema = new Schema({
	name: String,
	place: [placeSchema],
	cuisine: String,
	price: Number
});

var daySchema = new Schema({
	hotel: String,
	restaurants: Array, // TO DO: limit array length to 3
	things: Array,
	name: String 
});

// var day = Day.create()

Place = mongoose.model('Place', placeSchema);
Hotel = mongoose.model('Hotel', hotelSchema);
ThingsToDo = mongoose.model('ThingsToDo', thingsToDoSchema);
Restaurant = mongoose.model('Restaurant', restaurantSchema);
Day = mongoose.model('Day', daySchema);

module.exports = {
	Place: Place,
	Hotel: Hotel,
	ThingsToDo: ThingsToDo,
	Restaurant: Restaurant
}