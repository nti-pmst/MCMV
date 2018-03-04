var express = require('express');
var app = express();
var rotas = require('./app/rotas');
var cors = require('cors');

app.use(cors());
app.get('/', function(req, res, err){
    if(err) { console.log(err); }

    res.send('Teste');
});

app.use('/sorteio', rotas);

app.listen(5000, function () {
    console.log('Dev app listening on port 5000!');
});