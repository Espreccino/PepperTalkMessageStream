# Pepper Talk Message Stream
Pepper Talk exposes a json stream of the activity of messages happening in real time. Its exposed via an access controlled http endpoint. The endpoint keeps the stream open and sends JSON encoded chunked data.

This sample app is a node.js implementation written in coffee script using plain simple http request to print the events as it comes in.

## Quick Start
* npm install
* grunt
* node js/app.js --client_id *your client id* --client_secret *your client secret*