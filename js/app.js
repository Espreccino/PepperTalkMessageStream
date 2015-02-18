
/*
 *
 *
 */

(function() {
  var argv, callback, client_credentials, https, options, port, req, stream_messages;

  argv = require("minimist")(process.argv.slice(2), {
    string: ["client_id", "client_secret", "host", "protocol"],
    "default": {
      host: "hostedpepper.getpeppertalk.com",
      protocol: "https"
    }
  });

  client_credentials = new Buffer(argv.client_id + ":" + argv.client_secret).toString('base64');

  port = argv.protocol === 'https' ? 443 : 80;

  https = require(argv.protocol);

  options = {
    host: argv.host,
    path: '/api/v1/get_access_token?grant_type=client_credentials&scope=stream',
    port: port,
    headers: {
      "Authorization": "Basic " + client_credentials
    }
  };

  callback = function(response) {
    var str;
    if (response.statusCode !== 200) {
      return console.log("Error authenticating " + response.statusCode);
    }
    str = '';
    response.on('data', function(chunk) {
      return str += chunk;
    });
    return response.on('end', function() {
      var auth;
      auth = JSON.parse(str);
      if (auth.access_token != null) {
        return stream_messages(auth);
      }
    });
  };

  req = https.get(options, callback);

  stream_messages = function(auth) {
    options = {
      host: argv.host,
      path: '/api/v1/message_activity_stream',
      port: port,
      headers: {
        "Authorization": "Bearer " + auth.access_token
      }
    };
    callback = function(response) {
      response.setEncoding('utf8');
      if (response.statusCode !== 200) {
        return console.log("Error tapping into stream " + response.statusCode);
      }
      response.on('data', function(chunk) {
        console.log(JSON.parse(chunk));
        return console.log("");
      });
      return response.on('end', function() {
        return console.log("Stream ended");
      });
    };
    req = https.get(options, callback);
    return req.end();
  };

}).call(this);
