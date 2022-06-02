let online_users = new Array();
let user_requests = new Array();
let ongame_users = new Array();
let myself;
let opponent;

function registerUser () {
    myself = document.getElementById("loggedUsername").textContent;
    sendWebSocket(JSON.stringify(new Message( "user_registration", "",myself, "WebSocket")));
}

ws.onmessage = function (event) {
    console.log("message received: "+ event.data);

    let jsonString = JSON.parse(event.data);
    let type = jsonString.type;
    let data = jsonString.data;
    let sender = jsonString.sender;
    let receiver = jsonString.receiver;
    console.log("ONLINE:" + online_users);
    console.log("ONGAME:" + ongame_users);
    console.log("sender: " + sender + " receiver: " + receiver);
    switch (type){
        case "user_list":
            for(let i=0; i<data.length; i++){
                online_users.push(data[i]);
                if(i < 5)
                    addUserTable(data[i]);
            }
            break;

        case "add_user":
            addUserTable(data);
            online_users.push(data);
            break;

        case "delete_user":
            deleteUserTable(data);
            if(online_users.includes(data))
            {
                index = online_users.indexOf(data);
                online_users.splice(index, 1);
            }
            break;
        case "ongame_user":
            index = online_users.indexOf(data);
            online_users.splice(index, 1);
            ongame_users.push(data);
            deleteUserTable(data);
            deleteRequestTable(data);
            console.log(online_users + ";" + ongame_users);
            break;
        case "ongame_list":
            for(let i=0; i<data.length; i++){
                ongame_users.push(data[i]);
            }
            console.log("" +
                "ongame:" + ongame_users);
            break;
        case "send_request":
            user_requests.push(sender);
            addReqTable(sender);
            break;
        case "cancel_request":
            index = user_requests.indexOf(sender);
            user_requests.splice(index, 1);
            let row = document.getElementById("request_" + sender);
            row.remove();
            break;
        case "accept_request":
            alert("request accepted by " + sender);
            opponent = sender;
            notifyOnGame();
            location.href = "pages/battleship.jsp?opponent="+opponent+"&first_turn=true";
            break;

        case "info":
            alert(data);
            if(data == "Request correctly accepted!") {
                location.href = "pages/battleship.jsp?opponent="+opponent+"&first_turn=false";
            }
            break;

        case "error":
            alert(data);
            //location.href = "./logout-servlet";
            break;

        default:
            break;
    }
}

function registerUser () {
    myself = document.getElementById("loggedUsername").textContent;
    sendWebSocket(JSON.stringify(new Message( "user_registration", "",myself, "WebSocket")));
}

function addUserTable(user) {
    let table_body = document.getElementById("onlineUsers");

    let tr = document.createElement('tr');
    let td_username = tr.appendChild(document.createElement('td'));
    let td_status = tr.appendChild(document.createElement('td'));
    let td_score = tr.appendChild(document.createElement('td'));
    let td_button = tr.appendChild(document.createElement('td'));
    let button = td_button.appendChild(document.createElement("button"));
    let span = td_status.appendChild(document.createElement("span"));
    let img = span.appendChild(document.createElement("img"));

    button.setAttribute("type","button");
    button.setAttribute("id", "button_"+user);
    button.setAttribute("value","sendRequest");
    button.setAttribute("class","buttonRequest");
    button.setAttribute("onclick", "sendRequest(\""+user+"\");");
    img.setAttribute("src", "./images/online-icon.png");
    img.setAttribute("class", "icon");

    td_status.innerHTML = "Online";
    button.innerHTML = "Send Request";
    td_username.innerHTML = user;
    td_score.innerHTML = "0";
    tr.setAttribute("id", user);
    table_body.appendChild(tr);
    console.log(user+"\n");
}

function deleteUserTable(user){
    let row = document.getElementById(user);
    console.log(row);
    if(row != null)
        row.remove();
}

function deleteRequestTable(user){
    let row = document.getElementById("request_" + user);
    if(row != null)
        row.remove();
}

function sendRequest (user) {
    sendWebSocket(JSON.stringify(new Message("send_request", "", myself, user)));
    let button = document.getElementById("button_"+user);
    button.innerHTML = "Cancel Request";
    button.setAttribute("onclick", "cancelRequest(\""+user+"\");");
}

function acceptRequest(user){
    sendWebSocket(JSON.stringify(new Message("accept_request", "", myself, user)));
    opponent = user;
}

function notifyOnGame(){
    sendWebSocket(JSON.stringify(new Message("ongame_user", "", myself, "WebSocket")));
}

function cancelRequest(user){
    document.getElementById("button_"+user).innerText = "Send Request";
    sendWebSocket(JSON.stringify(new Message("cancel_request", "", myself, user)));
}

function addReqTable(user) {
    let table_body = document.getElementById("userRequests");

    let tr = document.createElement('tr');
    let td_username = tr.appendChild(document.createElement('td'));
    let td_score = tr.appendChild(document.createElement('td'));
    let td_button = tr.appendChild(document.createElement('td'));
    let button = td_button.appendChild(document.createElement("button"));

    td_username.setAttribute("class","center");
    td_score.setAttribute("class","center");
    td_button.setAttribute("class","center");

    button.setAttribute("type","button");
    button.setAttribute("value","acceptRequest");
    button.setAttribute("class","buttonRequest");
    button.setAttribute("onclick", "acceptRequest(\""+user+"\");");

    button.innerHTML = "Accept Request";
    td_username.innerHTML = user;
    td_score.innerHTML = "0";
    tr.setAttribute("id", "request_"+user);
    table_body.appendChild(tr);
    console.log(user+"\n");
}

function moveUser(user){

    let searchedRow = document.getElementById("searched_" + user);
    searchedRow.remove();
    addUserTable(user);
}

function findUser(){

    console.log("FINDUSER");
    /*if(user == myself)
        return;
    */

    if(document.getElementById("userSearch").textContent == myself)
        return;

    let user = document.getElementById("userSearch").textContent;

    console.log(online_users);
    console.log(ongame_users);

    let table = document.createElement("table");
    table.setAttribute("id", "searchedUser");

    console.log(document.getElementById("search-container"));
    document.getElementById("search-container").appendChild(table);
    let tr = document.createElement("tr");
    tr.setAttribute("id", "searched_"+user);
    table.appendChild(tr);
    /*
    if(exists == "false")
    {
        let span = document.createElement("span");
        tr.appendChild(span);
        span.innerHTML = "No user with this username";
        return;
    }*/

    let td_username = tr.appendChild(document.createElement('td'));
    let td_status = tr.appendChild(document.createElement('td'));
    let span = td_status.appendChild(document.createElement("span"));
    let img = span.appendChild(document.createElement("img"));
    img.setAttribute("class", "icon");
    tr.appendChild(img);
    let td_score = tr.appendChild(document.createElement('td'));

    td_username.innerHTML = user;
    td_score.innerHTML = "0";

    if(document.getElementById(user) == null && online_users.includes(user))
    {
        let td_button = tr.appendChild(document.createElement('td'));
        let button = td_button.appendChild(document.createElement("button"));
        button.setAttribute("type","button");
        button.setAttribute("id", "button_"+user);
        button.setAttribute("value","sendRequest");
        button.setAttribute("class","buttonRequest");
        button.setAttribute("onclick", "moveUser(\""+user+"\");");
    }

    if(online_users.includes(user)) {
        td_status.innerHTML = "Online";
        img.setAttribute("src", "./images/online-icon.png");
    }
    else if(ongame_users.includes(user)) {
        td_status.innerHTML = "Gaming";
        img.setAttribute("src", "./images/ongame-icon.png");
    }
    else{
        td_status.innerHTML = "Offline";
        img.setAttribute("src", "./images/offline-icon.png");
    }

}