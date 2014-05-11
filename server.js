var express = require('express'),
  http = require('http'),
  feedparser = require('ortoo-feedparser'),
  app = express();




app.set('port', Number(process.env.PORT || 3001));

app.get('/feed/:url', function(req, res){
  function callback (meta, articles) {
    res.type('application/json');
    res.jsonp({ meta: meta, articles: articles});
  }

  console.log('Getting ' + req.params.url);
  feedparser.parseUrl(req.params.url)
    .on('complete', callback);
});

app.get('/feeds', function(req, res){
  var urls = req.query.urls || [],
    results = [],
    i = 0,
    max = urls.length;

  if (max > 0){
    for (;i < max;i++){
      console.log('Getting ' + urls[i]);
      feedparser.parseUrl(urls[i])
        .on('complete', callback);

    }
  } else {
    sendResults();
  }

function callback (meta, articles) {
  results.push({ meta: meta, articles: articles});

  if (results.length === max){
        sendResults();
  }
}
function sendResults(){
  res.type('application/json');
  res.jsonp(results);
}


});




http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
