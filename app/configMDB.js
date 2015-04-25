var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

var linkSchema = new mongoose.schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  timestamp: { type: Date, default: Date.now }
});

var userSchema = new mongoose.schema({
  username: String,
  password: String,
  timestamp: { type: Date, default: Date.now }
});

var Link = mongoose.model('Link', linkSchema);
var Link = mongoose.model('User', linkSchema);

var testLink = new Link({
  url: 'http://google.com'
})

testLink.save(function(err, testLink){
  if (err) return console.error(err);
})

module.exports = db;
