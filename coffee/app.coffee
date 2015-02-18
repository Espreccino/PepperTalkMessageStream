###
#
#
###
argv = require("minimist")(process.argv.slice(2), {
  string: ["client_id", "client_secret", "host", "protocol"] 
  default: {
    host: "hostedpepper.getpeppertalk.com"
    protocol: "https"
  }
})
client_credentials = new Buffer(argv.client_id + ":" + argv.client_secret).toString('base64')

port = if argv.protocol is 'https' then 443 else 80
https = require(argv.protocol);
options = {
  host: argv.host,
  path: '/api/v1/get_access_token?grant_type=client_credentials&scope=stream',
  port: port,
  headers: {
    "Authorization": "Basic " + client_credentials
  } 
}

callback = (response) ->
  return console.log("Error authenticating " + response.statusCode) if response.statusCode isnt 200
  str = ''
  response.on('data', (chunk) ->
    str += chunk
  )
  response.on('end', ->
    auth = JSON.parse(str)
    stream_messages(auth) if auth.access_token?
  )

req = https.get(options, callback)

stream_messages = (auth) ->
  options = {
    host: argv.host,
    path: '/api/v1/message_activity_stream',
    port: port,
    headers: {
      "Authorization": "Bearer " + auth.access_token
    } 
  }

  callback = (response) ->
    response.setEncoding('utf8')
    return console.log("Error tapping into stream " + response.statusCode) if response.statusCode isnt 200
    response.on('data', (chunk) ->
      console.log(JSON.parse(chunk))
      console.log("")
    )
    response.on('end', ->
      console.log("Stream ended")
    )

  req = https.get(options, callback)
  req.end()
  