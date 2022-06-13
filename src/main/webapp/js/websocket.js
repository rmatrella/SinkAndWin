class Message {
    constructor(type, data, sender, receiver) {
        this.type = type; // Type of the message, explain the content of the message (or type of error)
        this.data = data; // Data contained in the message, can be an object
        this.sender = sender; // username of sender
        this.receiver = receiver; // username of receiver
    }
}


// Create WebSocket connection.
let ws = new Object;
if (!("WebSocket" in window)) {
    alert("This browser does not support WebSockets");
} else {
    initWebSocket();
}

function initWebSocket() {
    ws = new WebSocket("ws://172.18.0.71:8090/ws");
    //ws = new WebSocket("ws://localhost:8090/ws");

    ws.onopen = function(event) {
        console.log("Websocket opened.");
    };

    ws.onmessage = function(event) {
        console.log("Message received: "+ event.data);
    };

    /**
     * Function used to close the web socket
     */
    ws.onclose = function() {
        console.log('Websocket closed');
        ws.close();

        location.href = "./index.jsp";
    };
}

function waitForSocketConnection(socket, callback){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                if (callback != null){
                    callback();
                }
            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection
}

ws.onerror = function(event) {
    console.error("WebSocket error observed:", event.data);
    ws.close();
    location.href = "./index.jsp?error=server unreachable, try later!";
};


/**
 * Function used to send a message with the web socket
 * @param message   Message to send
 */
function sendWebSocket(message) {
    ws.send(message);
    console.log('Message sent:' + message);
}

