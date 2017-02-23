var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

//Propetries
var port = process.env.PORT || 3000;

//#API -------------------------------------------------------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var json = fs.readFileSync('UsersJSON.json');
var jsonParse = JSON.parse(json);

//Welcome Page
app.get('/', function(request, response){
  response.send('Welcome to Leaderboard API');
});

//##Users
//### Retrieves a player's data with the score
app.get('/users/:id', function(request, response){
  var id = request.params.id;

  for(i = 0; i < jsonParse.length; i++)
  {
    if(id == jsonParse[i].id)
    {
      var resJson = {
        "name": jsonParse[i].name,
        "score": jsonParse[i].score
      };
      response.send(resJson);
      break;
    }
  }
});
//### Stores player's new score
app.post('/users/:id', function(request, response){
  var id = request.params.id;
  var score = request.body.score;

  for(var i = 0; i < jsonParse.length; i++)
  {
    if(jsonParse[i].id == id)
    {
      jsonParse[i].score = score;

      var newJson = JSON.stringify(jsonParse);
      break;
    }
  }
  fs.writeFileSync('UsersJSON.json', newJson);

  response.send('(Y)');
});

//## User leaderboard
//### Retrieves a player's leaderboard position
app.get('/leaderboard/:id', function(request, response){
  var id = request.params.id;

  for(var i = 0; i < jsonParse.length; i++)
  {
    if(id == jsonParse[i].id)
    {
      var resJson = {
        "position": jsonParse[i].position
      };
      response.send(resJson);
      break;
    }
  }
});

//## Global leaderboard
//### Retrives paged leaderboard starting from the first player
app.get('/leaderboard', function(request, response){
  var pageSize = parseInt(request.query.pageSize);
  var page = parseInt(request.query.page);

  var pageSearch = pageSize*page;
  var pageSearchLimit = pageSearch + pageSize;

  var resJson = [];
  var count = 0;

  if(pageSize > jsonParse.length)
  {
    response.send('Theres not many players in the game');
  }
  else if(pageSearch >= jsonParse.length)
  {
    response.send('Enter true values');
  }
  else
  {
    for (var i = pageSearch; i < pageSearchLimit; i++)
    {
      resJson[count] = jsonParse[i];
      count++;
    }
  }
  response.send(resJson);
});

//Start listen
app.listen(port, function(){
  console.log("App start listen!");
});
