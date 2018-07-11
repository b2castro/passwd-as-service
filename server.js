/**
 * Filename: server.js
 *
 * Description: This file handles reading the etc/passwd and etc/groups files and placing their respective
 *              data into storage for later use. Moreover, this file uses Node.js + Express as server backend 
 *              for the application.
 *
 * Author: Bryle Castro
 **/
const express = require('express');
const app = express();

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('users.db');
const dbGroups = new sqlite3.Database('groups.db');



app.use(express.static('static_files'));

/*Insert or update data stored in users database based on changes made to password.txt*/
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('etc/passwd.txt')
});
lineReader.on('line', function(line) {
    let str = line;
    
    if (/\s/.test(str)) {
        throw 'etc/passwd file is malformed';
        // It has any kind of whitespace
    }

    let array = str.split(':');

    db.prepare("INSERT OR REPLACE INTO users (name,uid,gid,comment,home,shell) VALUES(?,?,?,?,?,?)").run(array[0], array[2], array[3], array[4], array[5], array[6]).finalize();

});

/*Insert or update data stored in users database based on changes made to groups.txt*/
var lineReaderGroups = require('readline').createInterface({
    input: require('fs').createReadStream('etc/groups.txt')
});
lineReaderGroups.on('line', function(line) {
    let str = line;
    let array = str.split(':');
     if (/\s/.test(str)) {
        throw 'etc/groups file is malformed';
         // It has any kind of whitespace
    }

    dbGroups.prepare("INSERT OR REPLACE INTO groups (name,gid,member) VALUES(?,?,?)").run(array[0], array[2], array[3]).finalize();
});



/* Get a list of all groups on the system, a defined by /etc/group.txt */
app.get('/groups', (req, res) => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    dbGroups.all('SELECT * FROM groups', (err, rows) => {
        console.log(rows);
        const allUsernames = rows.map(e => e);
        console.log(allUsernames);
        res.send(allUsernames);
    });
});

/* Get all the groups.*/
app.get('/uidGroup', (req, res) => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    dbGroups.all('SELECT * FROM groups', (err, rows) => {
        console.log("Object returned: " + rows);
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

/* Handles functionality of getting group of a user*/
function getGroups(res, NAME) {

    var jsonString = JSON.stringify(NAME);
    jsonString = jsonString.trim();
    jsonString = jsonString.split(':')[1]
    jsonString = jsonString.split('"')[1]
    jsonString = jsonString.split('"')[0]
    let error404 = "User " + jsonString + " not found";
    dbGroups.all(

        'SELECT * FROM groups WHERE name=$name',
        // parameters to SQL query:
        {
            $name: jsonString
        },
        // callback function to run when the query finishes:
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows[0])
            } else {
                res.send({
                    error404
                }); // failed, so return an empty object instead of undefined
            }
        }
    );
}

/* Get all the groups for a given gid.*/
app.get('/groups/:usergid', (req, res) => {
    const gidToLookup = req.params.usergid; // matches ':userid' above

    let error404 = "Error 404: User with gid " + gidToLookup + " not found";
    var x;
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    dbGroups.all(

        'SELECT * FROM groups WHERE gid=$gid',
        // parameters to SQL query:
        {
            $gid: gidToLookup
        },
        // callback function to run when the query finishes:
        (err, rows) => {
            if (rows.length > 0) {
               res.send(rows[0])
            } else {
                res.send({
                    error404
                }); // failed, so return an empty object instead of undefined
            }
        }
    );

});


/* Get all the groups for a given uid.*/
app.get('/uidGroup/:userid', (req, res) => {
    const idToLookup = req.params.userid; // matches ':userid' above

    let error404 = "Error 404: User with uid " + idToLookup + " not found";
    var x;
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(

        'SELECT name FROM users WHERE uid=$uid',
        // parameters to SQL query:
        {
            $uid: idToLookup
        },
        // callback function to run when the query finishes:
        (err, rows) => {

            if (rows.length > 0) {
                getGroups(res, rows[0]);
            } else {
                res.send({
                    error404
                }); // failed, so return an empty object instead of undefined
            }
        }
    );

});

/* Get a single user with <uid>. Return 404 if <uid> is not found. */
app.get('/users/:userid', (req, res) => {
    const idToLookup = req.params.userid; // matches ':userid' above
    let error404 = "Error 404: User with uid " + idToLookup + " not found";
    console.log("this one " + idToLookup);
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
                res.send({
                    error404
                }); // failed, so return an empty object instead of undefined
            }
        }
    );
});

/*Get users based on specifed optional query parameters*/
app.get('/query', (req, res) => {
    let nameToLookup = req.query.param1;
    let idToLookup = req.query.param2;
    let gidToLookup = req.query.param3;
    let commentToLookup = req.query.param4;
    let homeToLookup = req.query.param5;
    let shellToLookup = req.query.param6;

    //console.log(req.query.param5);    
    if (nameToLookup == '') {
        nameToLookup = null;
    }
    if (idToLookup == '') {
        idToLookup = null;
    }
    if (gidToLookup == '') {
        gidToLookup = null;
    }
    if (commentToLookup == '') {
        commentToLookup = null;
    }
    if (homeToLookup == '') {
        homeToLookup = null;
    }
    if (shellToLookup == '') {
        shellToLookup = null;
    }

    let error404 = "Error 404: User not found";
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
        'SELECT * FROM users WHERE (name = $name OR $name IS NULL) AND (uid = $uid OR $uid IS NULL) AND (gid = $gid OR $gid IS NULL) AND (comment = $comment OR $comment IS NULL) AND (home = $home OR $home IS NULL) AND (shell = $shell OR $shell IS NULL)',
        // parameters to SQL query:
        {
            $uid: idToLookup,
            $name: nameToLookup,
            $gid: gidToLookup,
            $comment: commentToLookup,
            $home: homeToLookup,
            $shell: shellToLookup

        },
        // callback function to run when the query finishes:
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.send({
                    error404
                }); // failed, so return an empty object instead of undefined
            }
        }
    );
});

/*Get user groups based on specifed optional query parameters*/
app.get('/gq', (req, res) => {
    let nToLookup = req.query.param1;
    let gToLookup = req.query.param2;
    let mToLookup = req.query.param3;

    console.log(nToLookup);
    console.log(gToLookup);
    console.log(mToLookup);
    //console.log(req.query.param5);    
    if (nToLookup == '') {
        nToLookup = null;
    }
    if (gToLookup == '') {
        gToLookup = null;
    }
    if (mToLookup == '') {
        mToLookup = null;
    }
    console.log(mToLookup);

    let error404 = "Error 404: Group not found";
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    dbGroups.all(
        'SELECT * FROM groups WHERE (name = $name OR $name IS NULL) AND (gid = $gid OR $gid IS NULL) AND (gid = $gid OR $gid IS NULL) AND (member LIKE $mem OR $member IS NULL )',
        // parameters to SQL query:
        {

            $name: nToLookup,
            $gid: gToLookup,
            $member: mToLookup,
            $mem: "%" + mToLookup + "%"

        },
        // callback function to run when the query finishes:
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.send({
                    error404
                }); // failed, so return an empty object instead of undefined
            }
        }
    );
});



// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/');
    
});