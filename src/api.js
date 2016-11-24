exports.getExamInfo = function (root, cb1, cb2) {
  root.$http.get('http://localhost:8888/examInfo').then(cb1).then(cb2)
}

exports.getUserList = function (root, cb) {
  root.$http.get('http://localhost:8888/userList').then(cb)
}

exports.getSubjectList = function (root, cb) {
  root.$http.get('http://localhost:8888/subjectList').then(cb)
}

exports.login = function (root, usr, pwd, cb) {
  var jsonData = {usr: usr, pwd: pwd}
  root.$http.post('http://localhost:8888/login', jsonData).then(cb)
}

exports.caluTime = function (fromtime, totime) {
  var total
  var nowdate = new Date().getTime()
  var startdate = new Date(fromtime).getTime()
  var enddate = new Date(totime).getTime()
  var entries = {}

  if (startdate - nowdate > 0) {
    total = (startdate - nowdate) / 1000
    entries.type = 0
    entries.info = '倒计时'
  } else if ((startdate - nowdate < 0) && (enddate - nowdate > 0)) {
    total = (enddate - nowdate) / 1000
    entries.type = 1
    entries.info = '考试中'
  } else if (enddate - nowdate < 0) {
    total = 0
    entries.type = 2
    entries.info = '已结束'
  }
  var day = parseInt(total / (24 * 60 * 60))
  var afterDay = total - day * 24 * 60 * 60
  var hour = parseInt(afterDay / (60 * 60))
  var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60
  var min = parseInt(afterHour / 60)
  var afterMin = parseInt(total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60)
  min = '' + min
  afterMin = '' + afterMin;
  (min.length < 2) ? min = '0' + min : '';
  (afterMin.length < 2) ? afterMin = '0' + afterMin : '';
  (total < 0) ? hour = min = afterMin = 0 : ''
  entries.time = hour + ':' + min + ':' + afterMin
  return entries
}
