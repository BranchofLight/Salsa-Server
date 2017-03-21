/**
 * Purpose: Main server code.
 * Source:  mainServer.js
 */
 /* TODO:
  * 1) Fix 1 to many relationship with event_cost ( I believe this is fixed )
  * 2) Process and return from a POST request
  */

var http = require('http');
var sqlite3 = require('sqlite3').verbose();

var port = process.env.PORT || 3000;
var db = new sqlite3.Database(':memory:');

var debugFlag = true;
var DEBUG = function() {
    if (debugFlag) {
      var msg = "";
      for (var i = 0; i < arguments.length; i++) {
        msg += arguments[i];
      }

      console.log("DEBUG: ", msg);
    }
};

/**
 * Create a datetime from a Date that can be used with the database
 * @param {Date} d
 * @return {Number}
 */
var createDBTime = function(d) {
  return Date.parse(d)/1000;
};

var dbSetup = function() {
  db.serialize(function() {
    var createEventTable = function() {
      db.run("CREATE TABLE event(" +
          "event_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
          "name TEXT NOT NULL," +
          "description TEXT," +
          "start_datetime INTEGER," +
          "end_datetime INTEGER," +
          "cost REAL," +
          "website TEXT," +
          "o_id INTEGER," +
          "v_id INTEGER," +
          "FOREIGN KEY(o_id) REFERENCES organizer(org_id)," +
          "FOREIGN KEY(v_id) REFERENCES venue(venue_id)" +
          ")"
      );

      var stmt = db.prepare("INSERT INTO event VALUES ($id, $name, $desc, $start, $end, $cost, $site, $org, $venue)");
      stmt.run({
          $name: "First Salsa Event",
          $desc: "This is a test event. It corresponds with my birthday.",
          $start: createDBTime(new Date(1994, 3, 21, 12, 0, 0, 0)),
          $end: createDBTime(new Date()),
          $cost: 15.0,
          $site: "eie.io/first-event",
          $org: 1,
          $venue: 2
      });

      stmt.run({
          $name: "Salsa and Chips",
          $desc: "Be honest, you have nothing better to do.",
          $start: createDBTime(new Date(2016, 6, 7, 18, 30, 0, 0)),
          $end: createDBTime(new Date(2016, 6, 11, 11, 15, 0, 0)),
          $cost: 50.0,
          $site: "hotsalsa.ca/salsa-and-chips",
          $org: 1,
          $venue: 2
      });

      stmt.run({
          $name: "Salsa Siesta",
          $desc: "I apologize for these terrible names.",
          $start: createDBTime(new Date(2016, 9, 5, 16, 0, 0, 0)),
          $end: createDBTime(new Date(2016, 9, 5, 20, 30, 0, 0)),
          $cost: 6.0,
          $site: "salsasiesta.ca/siesta",
          $org: 2,
          $venue: 1
      });

      stmt.run({
          $name: "Salsa for Santa",
          $desc: "It's christmastime and you're lonely. Come dance.",
          $start: createDBTime(new Date(2016, 11, 25, 20, 0, 0, 0)),
          $end: createDBTime(new Date(2016, 11, 25, 22, 30, 0, 0)),
          $cost: 10.0,
          $site: "salsaforsanta.com/lonely-dance",
          $org: 2,
          $venue: 2
      });

      stmt.run({
          $name: "Last Salsa Ever",
          $desc: "The end [of the year] is nigh.",
          $start: createDBTime(new Date(2016, 11, 31, 22, 0, 0, 0)),
          $end: createDBTime(new Date(2016, 11, 31, 23, 45, 0, 0)),
          $cost: 125.0,
          $site: "notaripoff.com/last-dance",
          $org: 2,
          $venue: 1
      });
      stmt.finalize();

      db.each("SELECT * FROM event", function(err, row) {
          if (err) {
              DEBUG(err);
          } else {
              DEBUG("id: [" + row.event_id + "]\tname: [" + row.name + "]\trow.description: [" + row.description + "]" +
                  "\tstart_datetime: [" + row.start_datetime + "]\tend_datetime + [" + row.end_datetime + "]" +
                  "\tcost: [" + row.cost + "]\twebsite: [" + row.website + "]", "\torg_id: [" + row.o_id + "]\tvenue_id: [" + row.v_id + "]");
          }
      });
    }();

    var createOrganizerTable = function() {
      db.run("CREATE TABLE organizer(" +
          "org_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
          "name TEXT NOT NULL," +
          "phone_number TEXT," +
          "email TEXT," +
          "website TEXT" +
          ")"
      );

      var stmt = db.prepare("INSERT INTO organizer VALUES ($id, $name, $phone, $email, $site)");
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
              DEBUG(err);
          } else {
              DEBUG("id: [" + row.org_id + "]\tname: [" + row.name + "]\tphone_number: [" + row.phone_number + "]" +
                  "\temail: [" + row.email + "]\twebsite: [" + row.website + "]");
          }
      });
    }();

    var createVenueTable = function() {
      db.run("CREATE TABLE venue(" +
          "venue_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
          "name TEXT NOT NULL," +
          "country TEXT," +
          "province TEXT," +
          "city TEXT," +
          "postal_code TEXT," +
          "address TEXT," +
          "phone_number TEXT," +
          "website TEXT" +
        ")"
      );

      var stmt = db.prepare("INSERT INTO venue VALUES ($id, $name, $country, $prov, $city, $post, $address, $phone, $site)");
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
              DEBUG(err);
          } else {
              DEBUG("id: [" + row.venue_id + "]\tname: [" + row.name + "]\tcountry: " + "[" + row.country +
                          "]\tprovince: " + "[" + row.province + "]\tcity: [" + row.city + "]" +
                          "\tpostal_code: [" + row.postal_code + "]\taddress: [" + row.address +
                          "]\tphone_number: [" + row.phone_number + "]\twebsite: [" + row.website + "]");
          }
      });
    }();
  });
}();

/**
 * Gets the first row, in the table, with the id in the corresponding column
 * @param {String} table
 * @param {String} column
 * @param {Number} id
 * @return {Object}
 */
var queryForFirstRow = function(table, column, id, callback) {
  db.get("SELECT * FROM " + table + " WHERE " + column + " = " + id,
  function(err, row) {
    if (err) {
      DEBUG(err);
      callback(null);
    } else {
      callback(row);
    }
  });
};

/**
 * Gets all the events within the datetime range
 * and acts on them based on the callback
 * @param {Date} start
 * @param {Date} end
 * @param {Function(Array)} callback
 */
var findEvents = function(start, end, callback) {
  DEBUG("Finding events...");
  DEBUG("Start: ", start);
  DEBUG("End: ", end);

  var arr = [];
  db.each(("SELECT * FROM event WHERE start_datetime >= " + start + " AND end_datetime <= " + end),
  function(err, eventRow) {
    if (err) {
      DEBUG(err);
    } else {
      DEBUG("EVENT: ", eventRow.name);
      arr.push(eventRow);
    }
  },
  function(err, numOfRows) {
    if (err) {
      DEBUG(err);
    } else {
      DEBUG("Finished search. Found: ", numOfRows, " rows.");
      if (numOfRows > 0) {
        findOrganizers(arr, callback);
      } else {
        callback("");
      }
    }
  });
};

/**
 * Replace the org_id in the eventRows in arr with relevant Organizer object data
 * @param {Array} arr
 * @param {Function(Array)} callback
 */
var findOrganizers = function(arr, callback) {
  var query = function(i) {
    return new Promise(function(resolve, reject) {
      db.each(("SELECT * FROM organizer WHERE org_id = " + arr[i].o_id),
      function(err, orgRow) {
        if (err) {
          DEBUG(err);
          reject();
        } else {
          DEBUG("ORGANIZER: ", orgRow.name);
          arr[i].organizer = orgRow;
          delete arr[i].o_id;
        }
      },
      function(err, numOfRows) {
        if (err) {
          DEBUG(err);
          reject();
        } else {
          DEBUG("Finished organizer sweep. Found: ", numOfRows, " rows.");
          resolve();
        }
      });
    });
  };

  var promises = [];
  for (var i = 0; i < arr.length; i++) {
    promises.push(query(i));
  }

  Promise.all(promises)
  .then(function() {
    DEBUG("Organizer search success!");
    findVenues(arr, callback);
  })
  .catch(function() {
    DEBUG("Organizer search failed.");
    findVenues(arr, callback);
  });
};

/**
 * Replace the org_id in the eventRows in arr with relevant Organizer object data
 * @param {Array} arr
 * @param {Function(Array)} callback
 */
var findVenues = function(arr, callback) {
  var query = function(i) {
    return new Promise(function(resolve, reject) {
      db.each(("SELECT * FROM venue WHERE venue_id = " + arr[i].v_id),
      function(err, venRow) {
        if (err) {
          DEBUG(err);
          reject();
        } else {
          DEBUG("VENUE: ", venRow.name);
          arr[i].venue = venRow;
          delete arr[i].v_id;
        }
      },
      function(err, numOfRows) {
        if (err) {
          DEBUG(err);
          reject();
        } else {
          DEBUG("Finished venue sweep. Found: ", numOfRows, " rows.");
          resolve();
        }
      });
    });
  };

  var promises = [];
  for (var i = 0; i < arr.length; i++) {
    promises.push(query(i));
  }

  Promise.all(promises)
  .then(function() {
    DEBUG("Venue search success!");
    callback(arr);
  })
  .catch(function() {
    DEBUG("Venue search failed.");
    callback("");
  });
};

http.createServer(function(req, res) {
  res.writeHead(200, {
      'Content-Type': 'text/plain'
  });
  DEBUG("New connection.");

  if (req.method === "GET") {
    res.end('GET Request Received');
  } else if (req.method === "POST") {
    req.on('data', function(data) {
      var reqObj = JSON.parse(data);
      DEBUG("start raw: " + reqObj.start_datetime);
      DEBUG("end   raw: " + reqObj.end_datetime);
      // reqObj.start_datetime = new Date(reqObj.start_datetime).getTime() / 1000;
      // reqObj.end_datetime = new Date(reqObj.end_datetime).getTime() / 1000;
      // DEBUG("start processed: " + reqObj.start_datetime);
      // DEBUG("end   processed: " + reqObj.end_datetime);
      findEvents(reqObj.start_datetime, reqObj.end_datetime, function(arr) {
        res.end(JSON.stringify(arr));
      });
    });
  } else {
    res.end("Hello World.");
  }
}).listen(port, function() {
  DEBUG("Server running at http://salsa-server.herokuapp.com/" + ":" + port);
});
