const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"] 
  })
const token = process.env['discord-token']
const app = require('express')();
const fs = require('fs');
const http = require('http').Server(app);
const httpserver = require('http');
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;
const { parse } = require('querystring');

const mineflayer = require('mineflayer')


// load json file || const config = require('./config.json');

const express = require('express');
const server = express();

const mcIp = 'node6.mcdiamondfire.com'//node6.mcdiamondfire.com

const auth = process.env['authToken']

// Socket.io stuff

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});


var files = [
  "client.js",
  "style.css",
  "misc/favicon.ico"
  ];


console.log('[LOADING]:');
files.forEach(function(path) {
  console.log(path);
  app.get("/" + path, function(req, res) {
    res.sendFile(__dirname + "/" + path);
  });
});




io.on('connection', (socket) => {
  console.log('\n > Socket Event: ' + socket.id + " connected\n");
  let data = {username: "Server", message: "Connection Opened", type: "[Socket.IO] [ALERT]"}
  io.emit("userChatEvent", data);
  io.emit("connectMinecraftServer", mcIp);
  
});

io.on('connection', socket => {
  socket.on('disconnecting', () => {
    console.log('\n > Socket Event: ' + socket.id + ' disconnected\n');
    let data = {username: "Server", message: "Connection Closed", type: "[Socket.IO] [ALERT]"}
    io.emit("userChatEvent", data);
  });

  socket.on('disconnect', () => {
    // socket.rooms.size === 0
  });
  
  socket.on('sendMessage', function(data) {
    console.log(data)
    if (data['auth'] === auth) {
      bot.chat(data['message'])
    } else {
      console.log('[ERROR]: invalid auth token')
      io.emit("invalidAuth", {'none': false});
      
    }
  });
});

  

// mineflayer stuff

const bot = mineflayer.createBot({
  host: mcIp, // minecraft server ip
  username: 'hayden@willowmail.com', // username or email, switch if you want to change accounts
  auth: 'microsoft' // for offline mode servers, you can set this to 'offline'
 //port: 25565,                // only set if you need a port that isn't 25565
  // version: false,             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'        // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})



bot.on('chat', (username, message) => {
  console.log(`[CHAT] ${username}: ${message}`);
  let data = {username: username, message: username + ": " + message, type: "[CHAT]"}
  io.emit("userChatEvent", data);
})

bot.on('systemChat', (message) => {
  console.log(`[console] ${message}`);
})

bot.on('kicked', console.log)
bot.on('error', console.log)

// OPEN CONNECTIONS


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
  console.log(`Node.JS server running at http://localhost:4000/`);
});



//client.login(token);
// old load token client.login(config.token);

//httpserver.createServer(function (req, res) {}).listen(4000);