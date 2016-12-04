var express = require('express');
var app = express();
var http = require("http");
//var session = require("express-session")
var https = require("https");

var querystring = require("querystring");

var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));


//Web Deployment
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.listen(server_port, server_ip_address);

//var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
//var port      = process.env.OPENSHIFT_NODEJS_IPORT || 3000;
//app.listen(port, ipaddress);

// app.post("/prediction/neural-network", neuralNetwork);
// app.post("/prediction/linear-regression", linearRegression);
// app.post("/prediction/random-regression",randomForestRegression);
app.post("/prediction/regression",regression);
app.post("/classification",classification);
app.post("/clustering",clustering);
//maml-server.js
var result = '';

function classification(req, res){
    var data = req.body;
    var path = '/workspaces/45b46042032542099deeace0661fa453/services/5f98e39eacf94210bd07a15cccd93f05/execute?api-version=2.0&details=true';
    var key = 'xK6476WlmU+OrpncGWUIa9uA2vWpfe2tkhStHctDCGDgIKwVEjf+WecIhDaWuD8swhlo6R0KtzV5eEwZdLhloA==';
    getPred(data, path, key);
    setTimeout(function() {
        console.log(result);
        res.json(result);
    }, 1000);

}

function regression(req, res){
    var data = req.body;
    var path = '/workspaces/0e6e3268518847ab90cb1087c291e541/services/55103cd672ca48daa7d8f2cdc6038e8d/execute?api-version=2.0&details=true';
    var key = '4PSBt+Mu5bdQh0GmbPCsVwv/qfW1Xt8cQbhlTcvFny37m2tEictUytGt8Uorh1b+WGNaHT2OayaGP7v/u9bTkA==';
    getPred(data, path, key);
    setTimeout(function() {
        res.json(result);
    }, 10000);
}

function clustering(req, res){
    var data = req.body;
    var path = '/workspaces/0e6e3268518847ab90cb1087c291e541/services/4677e4ecdc944cc8aa73246eaa6f8fe3/execute?api-version=2.0&details=true';
    var key = 'kPcOtYDwY3waaMRYzstYJsSRVBN+1XapZVsMI+so63DD4bJgAsofAwlnH1F0ri6CuJ0Y+6aqMWPioodN75CksQ==';
    getPred(data, path, key);
    setTimeout(function() {
        res.json(result);
    }, 1000);
}

function neuralNetwork(req, res){
    var data = req.body;
    var path = '/workspaces/0e6e3268518847ab90cb1087c291e541/services/9983168ed5e9423e9793d33f7b4dad67/execute?api-version=2.0&details=true';
    var key = 'QuZ0cj80JjZQkxNwXLN225jQY2V3SQ1ZRSfuU7NfjHxnoyQvKLqYtprJ4e1rSiLYAc3UfC0ObP50xkAnDC0haw==';
    getPred(data, path, key);
    setTimeout(function() {
        res.json(result);
    }, 1000);
}

function linearRegression(req, res){
    var data = req.body;
    var path = '/workspaces/0e6e3268518847ab90cb1087c291e541/services/00677f69dcb04fd4b6b32935e8d682d5/execute?api-version=2.0&details=true';
    var key = 'Ml+nsBT3bYQhRhJGVMFc5a4IHr2/5hL8OXsnvkiyM9FGz8RVS5BpSQ0rmZ6aMCHEL8RLvZKjhZNDq8kPSqcTHQ==';
    getPred(data, path, key);
    setTimeout(function() {
        res.json(result);
    }, 1000);
}

function randomForestRegression(req, res){
    var data = req.body;
    var path = '/workspaces/0e6e3268518847ab90cb1087c291e541/services/5bcf5235b7154b6fa6c46e020ed462cf/execute?api-version=2.0&details=true';
    var key = 'ebHOWYvKOBhB2QXyC2SCsZRy05YBwfWyNFIk1qkf39ppDw9+ET5CVeE8mXP1KoJBBBJzJ8tXrNFnA4wbBqbwDw==';
    getPred(data, path, key);
    setTimeout(function() {
        res.json(result);
    }, 1000);
}


function getPred(data, path, api_key) {

    var dataString = JSON.stringify(data);
    var host = 'ussouthcentral.services.azureml.net';
    var headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api_key};

    var options = {
        host: host,
        port: 443,
        path: path,
        method: 'POST',
        headers: headers
    };

    result = '';
    var reqPost = https.request(options, function (res) {
        res.on('data', function (d) {
            setTimeout(function() {
                process.stdout.write(d);
                result += d;
            }, 300);
            //return d;
        });
    });

// Would need more parsing out of prediction from the result
    reqPost.write(dataString);
    reqPost.end();
    reqPost.on('error', function (e) {
        console.error(e);

    });
    //console.log(result);
    //return result;
}

function send404Reponse(response) {
    response.writeHead(404, {"Context-Type": "text/plain"});
    response.write("Error 404: Page not Found!");
    response.end();
}

function onRequest(request, response) {
    if(request.method == 'GET' && request.url == '/' ){
        response.writeHead(200, {"Context-Type": "text/plain"});
        fs.createReadStream("./index.html").pipe(response);
    }else {
        send404Reponse(response);
    }
}

http.createServer(onRequest).listen(8050);
//buildFeatureInput();