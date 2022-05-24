

waitForSocketConnection(ws, registerUser);

function registerUser () {
    var username = document.getElementById("loggedUsername").textContent;
    sendWebSocket(JSON.stringify(new Message( "user_registration", "",username, "WebSocket",)));
}