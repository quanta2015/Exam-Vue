exports.getUserList = function (root, cb1, cb2) {
  root.$http.get('http://localhost:8888/userList').then(cb1).then(cb2)
}
