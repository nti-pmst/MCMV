var async = require('async');
var mysql = require('mysql');
var MersenneTwister = require('mersenne-twister');
var gerador = new MersenneTwister();

var participantes = [];

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mcmv'
});

// var connection = mysql.createConnection({
//     host: 'mcmv.mysql.uhserver.com',
//     user: 'mcmv',
//     password: '*p0m9s8t7',
//     database: 'mcmv'
// });

connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected...');
});

exports.participantes = function (req, res, err) {
    connection.query('SELECT * FROM pessoas', function (err, results, fields) {
        if (err) { res.send(err); }
        res.send(results);
    });
};

exports.gerarNumeros = function (req, res, err) {
    gerador.init_seed(req.params.semente);

    connection.query('SELECT * FROM pessoas ORDER BY nome', function (err, results, fields) {
        if (err) { res.send(err); }

        results.forEach(pessoa => {
            gerarAproximados(pessoa, gerador.random_int31(), req.params.semente);
        });

        res.redirect('/sorteio');
    });
};

gerarAproximados = function (pessoa, hash, semente) {
    let diferenca = semente - hash;
    if (diferenca < 0) {
        diferenca = diferenca * -1;
    }

    connection.query(`UPDATE pessoas SET menorDiferenca = ${diferenca}, numeroUnico = ${hash} WHERE nis = ${pessoa.nis}`, function (err, results, fields) {
        if (err) { console.log(err); }
    });
};

exports.getIdosos = function(req, res, next){
    connection.query('SELECT * FROM pessoas WHERE idade > 59 ORDER BY menorDIferenca ASC, idade DESC, nome ASC;', function(err, results, fields){
        let contemplados = results.slice(0, 8);
        contemplados.forEach(element => {
            connection.query(`UPDATE pessoas SET contemplacao = "IDOSO" WHERE nis = ${element.nis}`, function(err, results){

            });
        });
        res.send({lista: results, contemplados: contemplados});        
    });
};

exports.getDeficientes = function(req, res, next){
    connection.query('SELECT * FROM pessoas WHERE deficiencia <> "0" AND deficiencia <> "" AND contemplacao <> "IDOSO" ORDER BY menorDIferenca ASC, idade DESC, nome ASC;', function(err, results, fields){
        let contemplados = results.slice(0, 8);
        contemplados.forEach(element => {
            connection.query(`UPDATE pessoas SET contemplacao = "DEFICIENTE" WHERE nis = ${element.nis}`, function(err, results){

            });
        });
        res.send({lista: results, contemplados: contemplados});  
    });
};

exports.getGeral = function(req, res, next){
    connection.query('SELECT * FROM pessoas WHERE contemplacao <> "DEFICIENTE" AND contemplacao <> "IDOSO" ORDER BY menorDIferenca ASC, idade DESC, nome ASC;', function(err, results, fields){
        let contemplados = results.slice(0, 254);
        contemplados.forEach(element => {
            connection.query(`UPDATE pessoas SET contemplacao = "GERAL" WHERE nis = ${element.nis}`, function(err, results){

            });
        });
        res.send({lista: results, contemplados: contemplados});  
    });
};