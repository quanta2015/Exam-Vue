var serverIp = 'http://121.196.218.1:8888'
// var serverIp = 'http://localhost:8888'

exports.getExamInfo = function (root, cb1) {
  root.$http.get(serverIp + '/examInfo').then(cb1)
}

exports.saveExamInfo = function (root, infos, cb) {
  var jsonData = {infos: infos}
  root.$http.post(serverIp + '/saveExamInfo', jsonData).then(cb)
}

exports.getUserList = function (root, cb) {
  root.$http.get(serverIp + '/userList').then(cb)
}

exports.getSubjectList = function (root, usr, cb) {
  var jsonData = {usr: usr}
  root.$http.post(serverIp + '/subjectList', jsonData).then(cb)
}

exports.login = function (root, usr, pwd, cb) {
  var jsonData = {usr: usr, pwd: pwd}
  root.$http.post(serverIp + '/login', jsonData).then(cb)
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

exports.saveExam = function (root, usr, subs, score, cb) {
  var jsonData = {usr: usr, subs: subs, score: score}
  root.$http.post(serverIp + '/saveExam', jsonData).then(cb)
}

exports.submitExam = function (root, usr, subs, cb) {
  var jsonData = {usr: usr, subs: subs}
  root.$http.post(serverIp + '/submitExam', jsonData).then(cb)
}

exports.startExam = function (root, usr, cb) {
  var jsonData = {usr: usr}
  root.$http.post(serverIp + '/startExam', jsonData).then(cb)
}

exports.exportPdf = function (root, cb) {
  root.$http.get(serverIp + '/export').then(cb)
}

exports.uploadFile = function (root, file, cb) {
  // var jsonData = {file}
  root.$http.post(serverIp + '/uploadFile', file).then(cb)
}

