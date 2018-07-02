
const express = require('express');
const app = express();


// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('users.db');
const dbGroups = new sqlite3.Database('groups.db');



app.use(express.static('static_files'));
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('etc/passwd.txt')
});

lineReader.on('line', function (line) {
let str = line;
let array = str.split(':');
    
db.prepare("INSERT OR REPLACE INTO users (name,uid,gid,comment,home,shell) VALUES(?,?,?,?,?,?)").run(array[0],array[2],array[3],array[4],array[5],array[6]).finalize();
    
  /* print them out to confirm their contents:
  db.each("SELECT name, uid, gid, comment, home, shell FROM users", (err, row) => {
      console.log(row.name + ": " + row.uid + ' - ' + row.gid + ' - ' + row.comment + ' - ' + row.home + ' - ' + row.shell );
  });*/ 
    
}); 

 
app.get('/users', (req, res) => {
   
    
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all('SELECT * FROM users', (err, rows) => {
    console.log(rows);
    const allUsernames = rows.map(e => e);
    console.log(allUsernames);
    res.send(allUsernames);
  });
});

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
