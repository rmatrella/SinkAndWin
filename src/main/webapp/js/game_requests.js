let myself;
let opponent;
let first;

/*
let time;
let timer;
*/

ws.onmessage = function (event) {
    console.log("message received: "+ event.data);

    let jsonString = JSON.parse(event.data);
    let type = jsonString.type;
    let data = jsonString.data;

    switch (type){

        case "error":
            console.log(data);
            showMoveMsg(7);
            break;

        case "game_move": //receiving of a game move
            checkReply(data);
            break;

        case "move_reply": //reply to a move (hit, missed, hit and sunk)
            receiveReply(data);
            break;

        case "surrender": //surrender of the opponent
            showMoveMsg(6);
            break;

        case "opponent_disconnected": //opponent disconnected
            showMoveMsg(7);
            break;

        default:
            break;
    }
}

//registration of the user after starting the game
function registerUser () {
    myself = document.getElementById("loggedUsername").textContent;
    opponent = document.getElementById("opponentUsername").textContent;
    first = document.getElementById("firstTurn").textContent;
    notifyOnGame(); //notifies he is on game
    setUp();
}

function sendMove(cell){
    sendWebSocket(JSON.stringify(new Message("game_move", cell, myself, opponent)));
}

function sendMoveReply(reply){
    sendWebSocket(JSON.stringify(new Message("move_reply", reply, myself, opponent)));
}

function notifyOnGame(){
    sendWebSocket(JSON.stringify(new Message("ongame_user", opponent, myself, "WebSocket")));
}
