// app/routes.js

// grab the nerd model we just created
var Nerd = require('./models/nerd');
var opentracing = require("opentracing");
var initTracer = require('jaeger-client').initTracer;

var jaegerConfig = {
    'serviceName': 'example-svc',
    'reporter': {
        logSpans: false,
        flushIntervalMs: 10,
    }
};
var options = {
    'tags': {
        'my-awesome-service.version': '1.1.2'
    },
    // 'metrics': metrics,
    // 'logger': L
};

const tracer = initTracer(jaegerConfig, options);
span = tracer.startSpan("http");
span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);

module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/nerds', function (req, res) {
        // use mongoose to get all nerds in the database
        Nerd.find(function (err, nerds) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err) {
                span.setTag(opentracing.Tags.ERROR, true);
                span.log({ 'event': 'error', 'error.object': err, 'message': err.message, 'stack': err.stack });
                span.finish();
                res.send(err);
            }
            span.log({ 'event': 'data_received', 'chunk_length': nerds.length });
            span.finish();
            res.json(nerds); // return all nerds in JSON format
        });
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};