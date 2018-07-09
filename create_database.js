// Node.js + Express server backend for passwdAsService
// v1 - use SQLite (https://www.sqlite.org/index.html) as a database
//
// Bryle Castro

// run this once to create the initial database as the users.db file
//   node create_database.js

// to clear the database, simply delete the users.db file:
//   rm users.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('users.db');
const dbGroups = new sqlite3.Database('groups.db');
// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE users (name TEXT UNIQUE, uid TEXT UNIQUE, gid TEXT, comment TEXT, home TEXT UNIQUE, shell TEXT)");

});

dbGroups.serialize(() => {
  // create a new database table:
  dbGroups.run("CREATE TABLE groups (name TEXT UNIQUE, gid TEXT, member TEXT)");
    
});

dbGroups.close();
db.close();
