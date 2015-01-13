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

app.get('/makers/:url/projects/:projectId', function(req, res){

  var template = fs.readFileSync("views/project.html", "utf8");
  var pageBuilder = handlebars.compile(template);

  diy({
    method: 'GET',
    uri: '/makers/' + req.params.url + '/projects/' + req.params.projectId
  }, function (err, body) {
    var pageText = pageBuilder(filterData('project', body.response));
    res.write(pageText);
    res.end();
  });
});

app.listen(3001);

/*
 helper function to filter out a small set of a response body
 */
function filterData(dataType, data) {
  switch (dataType) {
    case 'featured':
      return data.map(function (item) {
        return {
          projectId: item.id,
          title: item.title,
          nickname: item.maker.nickname,
          url: item.maker.url,
          image: item.clips[0].assets.web_220.url
        }
      });
    case 'project':
        return {
          avatar: data.maker.avatar.small.url,
          title: data.title,
          nickname: data.maker.nickname,
          image: data.clips[0].assets.web_480.url
        }
  }
}
