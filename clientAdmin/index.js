const express = require('express');
const app = express();
var path = require('path');
const port = 3030;


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname+'/public', 'views'));


app.get('/', function(req, res){
    console.log("Bang!");
    res.render('client',{title:'hey'});
  }
);
app.listen(port, (err,data) => {
    console.log(`Client app listening on port ${port}! ${err}`);
  });
