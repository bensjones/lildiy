var express = require('express');
var app = express();
var handlebars = require('handlebars');
var fs = require('fs');
var diy = require('diy')('*');

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {

  var template = fs.readFileSync("views/index.html", "utf8");
  var pageBuilder = handlebars.compile(template);

  diy({
    method: 'GET',
    uri: '/explore/featured'
  }, function (err, body) {
    var data = {};
    data.featuredData = filterData(body.response);
    var pageText = pageBuilder(data);
    res.write(pageText);
    res.end();
  });

});

app.listen(3001);

/*
 helper function to filter out a small set of a response body
 */
function filterData(data) {
  return data.map(function(item) {
    return {
      projectId: item.id,
      stamp: item.stamp,
      title: item.title,
      nickname: item.maker.nickname,
      image: item.clips[0].assets.web_220.url
    }
  });
}
