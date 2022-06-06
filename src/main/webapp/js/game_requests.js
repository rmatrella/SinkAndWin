let myself;
let opponent;
let first;

ws.onmessage = function (event) {
    console.log("message received: "+ event.data);

    let jsonString = JSON.parse(event.data);
    let type = jsonString.type;
    let data = jsonString.data;
    let sender = jsonString.sender;

    switch (type){

        case "error":
            alert(data);
            //location.href = "./logout-servlet";
            break;

        case "game_move":
            checkCell(data, sender);
            break;
        case "move_reply":
            moveReply(data);
            break;

        default:
            break;
    }
}

function registerUser () {
    myself = document.getElementById("loggedUsername").textContent;
    opponent = document.getElementById("opponentUsername").textContent;
    first = document.getElementById("firstTurn").textContent;
    notifyOnGame();
    setUp();
    //sendWebSocket(JSON.stringify(new Message( "user_registration", "",myself, "WebSocket")));
}

function sendMove(cell){
    sendWebSocket(JSON.stringify(new Message("game_move", cell, myself, opponent)));
}

function sendMoveReply(reply){
    sendWebSocket(JSON.stringify(new Message("move_reply", reply, myself, opponent)));
}

function notifyOnGame(){
    sendWebSocket(JSON.stringify(new Message("ongame_user", "", myself, "WebSocket")));
}