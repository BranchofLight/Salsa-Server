/**
 * Purpose: Main server code.
 * Source:  mainServer.js
 */
 /* TODO:
  * 1) Debug reqtype / reqobj with test POSTs from Hrishi
  * 2) Fix 1 to many relationship with event_cost
  * 3) Process and return from a POST request
  */

var http = require('http');
var sqlite3 = require('sqlite3').verbose();

var port = process.env.PORT || 3000;
var db = new sqlite3.Database(':memory:');

var debugFlag = true;
var debug = function(msg) {
    if (debugFlag) {
        console.log("DEBUG: " + msg);
    }
};

var dbSetup = function() {
  db.serialize(function() {
    var createEventTable = function() {
      db.run("CREATE TABLE event(" +
          "name TEXT PRIMARY KEY NOT NULL," +
          "description TEXT," +
          "start_datetime DATETIME," +
          "end_datetime DATETIME," +
          "cost REAL," +
          "website TEXT" +
          ")"
      );

      var stmt = db.prepare("INSERT INTO event VALUES ($name, $desc, $start, $end, $cost, $site)");
      stmt.run({
          $name: "First Salsa Event",
          $desc: "This is a test event. It corresponds with my birthday.",
          $start: (new Date(1994, 3, 21, 12, 0, 0, 0)).toISOString(),
          $end: (new Date()).toISOString(),
          $cost: 15.0,
          $site: "eie.io/first-event"
      });

      stmt.run({
          $name: "Salsa and Chips",
          $desc: "Be honest, you have nothing better to do.",
          $start: (new Date(2016, 6, 7, 18, 30, 0, 0)).toISOString(),
          $end: (new Date(2016, 6, 11, 11, 15, 0, 0)).toISOString(),
          $cost: 50.0,
          $site: "hotsalsa.ca/salsa-and-chips"
      });

      stmt.run({
          $name: "Salsa Siesta",
          $desc: "I apologize for these terrible names.",
          $start: (new Date(2016, 9, 5, 16, 0, 0, 0)).toISOString(),
          $end: (new Date(2016, 9, 5, 20, 30, 0, 0)).toISOString(),
          $cost: 6.0,
          $site: "salsasiesta.ca/siesta"
      });

      stmt.run({
          $name: "Salsa for Santa",
          $desc: "It's christmastime and you're lonely. Come dance.",
          $start: (new Date(2016, 11, 25, 20, 0, 0, 0)).toISOString(),
          $end: (new Date(2016, 11, 25, 22, 30, 0, 0)).toISOString(),
          $cost: 10.0,
          $site: "salsaforsanta.com/lonely-dance"
      });

      stmt.run({
          $name: "Last Salsa Ever",
          $desc: "The end [of the year] is nigh.",
          $start: (new Date(2016, 11, 31, 22, 0, 0, 0)).toISOString(),
          $end: (new Date(2016, 11, 31, 23, 45, 0, 0)).toISOString(),
          $cost: 125.0,
          $site: "notaripoff.com/last-dance"
      });
      stmt.finalize();

      db.each("SELECT * FROM event", function(err, row) {
          if (err) {
              debug(err);
          } else {
              console.log("name: [" + row.name + "]\trow.description: [" + row.description + "]" +
                  "\tstart_datetime: [" + row.start_datetime + "]\tend_datetime + [" + row.end_datetime + "]" +
                  "\tcost: [" + row.cost + "]\twebsite: [" + row.website + "]");
          }
      });
    }();

    var createOrganizerTable = function() {
      db.run("CREATE TABLE organizer(" +
          "name TEXT PRIMARY KEY NOT NULL," +
          "phone_number TEXT," +
          "email TEXT," +
          "website TEXT" +
          ")"
      );

      var stmt = db.prepare("INSERT INTO organizer VALUES ($name, $phone, $email, $site)");
      stmt.run({
          $name: "First Salsa Organizer",
          $phone: "(613) 869-8460",
          $email: "scottandrechek@gmail.com",
          $site: "eie.io"
      });

      stmt.run({
          $name: "Hot Salsa",
          $phone: "(613) 555-6969",
          $email: "hotsalsa@wordpress.org",
          $site: "hotsalsa.ca"
      });
      stmt.finalize();

      db.each("SELECT * FROM organizer", function(err, row) {
          if (err) {
              debug(err);
          } else {
              console.log("name: [" + row.name + "]\tphone_number: [" + row.phone_number + "]" +
                  "\temail: [" + row.email + "]\twebsite: [" + row.website + "]");
          }
      });
    }();

    var createVenueTable = function() {
      db.run("CREATE TABLE venue(" +
          "name TEXT PRIMARY KEY NOT NULL," +
          "country TEXT," +
          "province TEXT," +
          "city TEXT," +
          "postal_code TEXT," +
          "address TEXT," +
          "phone_number TEXT," +
          "website TEXT" +
        ")"
      );

      var stmt = db.prepare("INSERT INTO venue VALUES ($name, $country, $prov, $city, $post, $address, $phone, $site)");
      stmt.run({
          $name: "First Salsa Venue",
          $country: "Canada",
          $prov: "Ontario",
          $city: "Renfrew",
          $post: "K7V3Z8",
          $address: "364 Castleford Road",
          $phone: "(613) 432-8994",
          $site: "eie.io"
      });

      stmt.run({
          $name: "Salsa Studio Six",
          $country: "Canada",
          $prov: "Ontario",
          $city: "Ottawa",
          $post: "K1S5B6",
          $address: "1125 Colonel By Drive",
          $phone: "(613) 520-2600",
          $site: "sss.ca"
      });
      stmt.finalize();

      db.each("SELECT * FROM venue", function(err, row) {
          if (err) {
              debug(err);
          } else {
              console.log("name: [" + row.name + "]\tcountry: " + "[" + row.country +
                          "]\tprovince: " + "[" + row.province + "]\tcity: [" + row.city + "]" +
                          "\tpostal_code: [" + row.postal_code + "]\taddress: [" + row.address +
                          "]\tphone_number: [" + row.phone_number + "]\twebsite: [" + row.website + "]");
          }
      });
    }();
  });
}();

db.close();

http.createServer(function(req, res) {
  res.writeHead(200, {
      'Content-Type': 'text/plain'
  });
  debug("New connection.");

  if (req.method === "GET") {
    res.end('GET Request Received');
  } else if (req.method === "POST") {
    req.on('data', function(data) {
      var reqObj = JSON.parse(data);
      var start = reqObj.start_datetime;
      var end   = reqObj.end_datetime;

    });
    res.end('POST Request Received');
  } else {
    res.end("Hello World");
  }
}).listen(port, function() {
  console.log("Server running at http://salsa-server.herokuapp.com/" + ":" + port);
});
