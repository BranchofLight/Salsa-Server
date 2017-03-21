/* ***********
 * EVENT TABLE
 * *********** */
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

/* ***************
 * ORGANIZER TABLE
 * *************** */
db.run("CREATE TABLE organizer(" +
    "org_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
    "name TEXT NOT NULL," +
    "phone_number TEXT," +
    "email TEXT," +
    "website TEXT" +
    ")"
);

/* ***********
 * VENUE TABLE
 * *********** */
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
