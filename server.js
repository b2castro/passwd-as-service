
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


var lineReaderGroups = require('readline').createInterface({
  input: require('fs').createReadStream('etc/groups.txt')
});

lineReaderGroups.on('line', function (line) {
let str = line;
let array = str.split(':');
    
dbGroups.prepare("INSERT OR REPLACE INTO groups (name,gid,member) VALUES(?,?,?)").run(array[0],array[2],array[3]).finalize();
    
  /* print them out to confirm their contents:
  dbGroups.each("SELECT name, uid, gid, comment, home, shell FROM groups", (err, row) => {
      console.log(row.name + ": " + ' - ' + row.gid + ' - ' + row.member);
  });*/ 
    
}); 

app.get('/groups', (req, res) => {
   
    
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  dbGroups.all('SELECT * FROM groups', (err, rows) => {
    console.log(rows);
    const allUsernames = rows.map(e => e);
    console.log(allUsernames);
    res.send(allUsernames);
  });
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

/*
app.get('/users/:userid', (req, res) => {
  const idToLookup = req.params.userid; // matches ':userid' above
   let error404 = "Error 404: User with uid " +idToLookup + " not found";
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    'SELECT * FROM users WHERE uid=$uid',
    // parameters to SQL query:
    {
      $uid: idToLookup
    },
    // callback function to run when the query finishes:
    (err, rows) => {
      console.log(rows);
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({error404}); // failed, so return an empty object instead of undefined
      }
    }
  );
});*/

app.get('users/:name?/:userid?/:gid?/:comment?/:home?/:shell?', (req, res) => {
  const idToLookup = req.params.userid; // matches ':userid' above
  const nameToLookup = req.params.name;
  const gidToLookup = req.params.gid;
  const commentToLookup = req.params.comment;
  const homeToLookup = req.params.home;
  const shellToLookup = req.params.shell;
    
   let error404 = "Error 404: User not found";
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    'SELECT * FROM users WHERE name=$name AND uid=$uid',
    // parameters to SQL query:
    {
      $uid: idToLookup,
      $name: nameToLookup
      /*$gid:  gidToLookup,
      $comment: commentToLookup,
      $home: homeToLookup,
      $shell: shellToLookup*/
                 
    },
    // callback function to run when the query finishes:
    (err, rows) => {
      console.log(rows);
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({error404}); // failed, so return an empty object instead of undefined
      }
    }
  );
});



// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
