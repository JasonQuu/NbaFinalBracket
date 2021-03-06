// set up ========================
const express = require('express');
const app = express();                               // create our app w/ express
const morgan = require('morgan');             // log requests to the console (express4)
const mongoose = require('mongoose');                     // mongoose for mongodb
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

//require('./public/app.js')(app);

// configuration =================
mongoose.connect('mongodb://jasonqu:AuGm8xX9@ds135790.mlab.com:35790/jason-mongo');     // connect to mongoDB database on modulus.io

app.use('/public',express.static('public'));
//app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());


// define model =================
var Baskets = mongoose.model('Baskets', {
    user: String,
    basketName: String,
    basket: {
      round1: Array,
      semiConf: Array,
      conf: Array,
      final: Array
    },
    score: {
      round1: Array,
      semiConf: Array,
      conf: Array,
      final: Array
    }
});

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/getAll', function (req, res) {

    // use mongoose to get all todos in the database
    Baskets.find(function (err, Baskets) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err);

        res.json(Baskets); // return all basket in JSON format
    });
});

app.post('/api/updateBasket', function (req, res) {
    console.log(req.body);
    // create a todo, information comes from AJAX request from Angular
    var query = {'user': req.body.user};
    Baskets.findOneAndUpdate(query, req.body, {upsert: true, new: false}, function (err, basket) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Baskets.find(function (err, baskets) {
            if (err)
                res.send(err);
            res.json(baskets);
        });
    });

});

app.post('/api/newBasket', function (req, res) {
    console.log(req.body);
    // create a todo, information comes from AJAX request from Angular
    Baskets.create(req.body, function (err, basket) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Baskets.find(function (err, baskets) {
            if (err)
                res.send(err)
            res.json(baskets);
        });
    });

});




app.get('', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
