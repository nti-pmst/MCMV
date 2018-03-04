var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var APP = require('./app');

//gerar numeros pela semente
router.get('/gerar/:semente', APP.gerarNumeros);
router.get('/', APP.participantes);

router.get('/idosos', APP.getIdosos);
router.get('/deficientes', APP.getDeficientes);
router.get('/geral', APP.getGeral);

// router.get('/grupo/:num', APP.contemplados);

//sorteio passando a categoria
// router.post('/sortear/:num', APP.sortearGrupo);

module.exports = router;