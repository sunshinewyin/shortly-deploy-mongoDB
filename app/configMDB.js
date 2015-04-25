var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');


var linkSchema = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  timestamp: { type: Date, default: Date.now }
});

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  timestamp: { type: Date, default: Date.now }
});

var Link = mongoose.model('Link', linkSchema);
var User = mongoose.model('User', userSchema);

module.exports = { LinkMDB: Link,
                   UserMDB: User
                 };
