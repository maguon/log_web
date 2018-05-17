/**
 * Created by lingxue on 2017/2/22.
 */

var restify = require('restify');
(function main() {

    var server = restify.createServer({
        name: 'LOG_DEV',
        version: '0.0.1'
    });
    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","x-requested-with,content-type");
    server.use(restify.CORS());

    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());

    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map|csv)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './web', default: 'index.html', maxAge: 0 }));


    server.get(/\.html$/i,restify.serveStatic({
        directory: './web',
        maxAge: 0}));
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './web',
        maxAge: 0}));
    server.listen(8000, function onListening() {
        console.log("log web project start at :" +new Date().toLocaleString())
        server.get('/',restify.serveStatic({
            directory: './web',
            default: 'index_home.html',
            maxAge: 0
        }));
    });
})();