exports.getUserList = function (root, cb1, cb2) {
  root.$http.get('http://localhost:8888/userList').then(cb1).then(cb2)
}

exports.login = function (root, usr, pwd, cb) {
  var jsonData = {usr: usr, pwd: pwd}
  root.$http.post('http://localhost:8888/login', jsonData).then(cb)
}
