const assert = require('assert');

var getUsersTest = '{"name": "root", "uid": 0, "gid": 0, "comment": "root", "home": "/root", "shell": "/bin/bash"}, {"name": "dwoodlins", "uid": 1001, "gid": 1001, “comment”: “”, “home”: "/home/dwoodlins", “shell”: "/bin/false"}'

it('correctly retrieves all users', () => {
  assert.equal(4, getUsersTest);
});