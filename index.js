'use strict';

const express = require('express');
const app = express();
const config = require('./config');
const bodyParser = require('body-parser');

const port = 5000;
const server = app.listen(process.env.PORT || port, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
const io = require('socket.io')(server);

app.enable('trust proxy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('private', express.static(__dirname + '/private'));

app.set('port', (process.env.PORT || port));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const weatherRoutes = require('./lib/weather/weather.routes');
const homeRoutes = require('./lib/home/home.routes')(io);
const smsRoutesTextBelt = require('./lib/sms/textBelt/textBelt.routes');
const smsRoutesNexmo = require('./lib/sms/nexmo/nexmo.routes');
const tradingRoutes = require('./lib/trading/oanda/oanda.routes');
const aiapiRoutes = require('./lib/ai/apiai/apiai.routes');
const aiapiLanguagesRoutes = require('./lib/ai/apiai/languages/languages.routes');
const latestPricesRoutes = require('./lib/trading/fixer/fixer.routes');

app.use('/', homeRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/v1/sms', smsRoutesTextBelt);
app.use('/api/v2/sms', smsRoutesNexmo);
app.use('/api/trading/accounts', tradingRoutes);
app.use('/api/trading/prices', latestPricesRoutes);
app.use('/api/apiai/', aiapiRoutes);
app.use('/api/apiai/languages', aiapiLanguagesRoutes);

app.use((req, res, next) => {
    const err = new Error('You are trying to access something that is not here ...');

    err.status = 404;
    next(err);
});

if (app.get('env') === config.dev) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({reason: 'oops error ... ', error: err, message: err.message, stacktrace: err});
        next();
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({reason: 'error', error: {}, message: err.message});
    next()
});

module.exports = io;
