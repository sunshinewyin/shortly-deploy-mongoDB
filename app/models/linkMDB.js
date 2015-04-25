var db = require('./configMDB.js');

var Link = db.model('Link', linkSchema);

var testLink = new Link({
  url: 'http://google.com'
})

testLink.save(function(err, testLink){
  if (err) return console.error(err);
})

module.exports = Link;
