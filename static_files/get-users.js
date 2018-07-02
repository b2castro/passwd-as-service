
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('users.db');

function getAllUsers(){
  db.each("SELECT * FROM users", (err, row) => {
      console.log(row.name + ": " + row.uid + ' - ' + row.gid + ' - ' + row.comment + ' - ' + row.home + ' - ' + row.shell );
  });
}