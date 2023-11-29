var socket = io();
var chatlog = [];

document.getElementById("password").value = getCookie(password)

socket.on('userChatEvent', function(data) {
  console.log(data)

  var time = new Date();
  data['time'] = time;
  chatlog.unshift(data);
  let chatmessages = ""
  var element = document.getElementById("chatbox");
  chatlog.forEach(function(chat) {
    let cusername = chat['username']
    let cmessage = chat['message']
    let ctype = chat['type']
    let timestamp = chat['time']
    var h = timestamp.getHours();
    var m = timestamp.getMinutes();
    var s = timestamp.getSeconds();
    chatmessages = chatmessages + `[${h}:${m}:${s}]` + ` ${ctype} ` + cmessage + "<br>"
  });
  element.innerHTML = chatmessages;
});

socket.on('connectMinecraftServer', function(data) {
  document.getElementById("server").innerHTML = `IP Address: ${data}`;
});
socket.on('invalidAuth', function(data) {
  alert("can u like, enter a correct password bro?1 ");
});

function onChatSumbit(){
  let pass = document.getElementById("password")
  let message = document.getElementById("sendmessage")
  
  sendData = {'auth': pass.value, 'message': message.value}
  socket.emit('sendMessage', sendData)
  console.log(sendData);
  message.value = ""
  setCookie(password, pass.value, 365)
  
  
  
}
document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
  if (document.activeElement === document.getElementById("sendmessage")) {
  if (code == "Enter") {
    onChatSumbit();
  }
  }
}, false);


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}