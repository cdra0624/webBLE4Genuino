navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var localStream;
var connectedCall;
var connectedData = null;

var peer = new Adawarp();

window.onload = function(){
  displayMyCamera();
  getMyID();
  peer.login();
}

function getMyID() {
  peer.on('open', function(){
    document.getElementById("my-id").innerHTML = peer.id;
  });
}

peer.on('connection', function(conn) {
  connectedData = conn;
  conn.on('data', function(data){
    console.log(data + ", typeof : " + typeof(data));
    document.getElementById("receive_message").innerHTML = data;
  });
});

peer.on('call', function(call){
  connectedCall = call;
  document.getElementById("peer-id").innerHTML = call.peer;
  call.answer(localStream);

  call.on('stream', function(stream){
    var url = URL.createObjectURL(stream);
    document.getElementById("peer-video").src = url;
  });
});


function displayMyCamera(){
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    localStream = stream;
    document.getElementById("my-video").src = URL.createObjectURL(stream);
  }, function() { alert("Error!"); });
}

function callStart(){
  conn = peer.connect(peer_id);
  conn.on('open', function() {
    conn.send('HelloWorld');
  });
  var peer_id = document.getElementById("peer-id-input").value;
  var call = peer.call(peer_id, localStream);
  call.on('stream', function(stream){
    document.getElementById("peer-id").innerHTML = peer_id;
    var url = URL.createObjectURL(stream);
    document.getElementById("peer-video").src = url;
  });
}

function callEnd() {
  connectedCall.close();
  connectedData.close();
}