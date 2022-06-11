let online_users = new Array();
let user_requests = new Array();
let ongame_users = new Array();
let myself;
let opponent;
let currentIndex = 0;

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

    switch (type){

        case "user_list":
            shuffle(data);
            for(let i=0; i<data.length; i++){
                online_users.push(data[i]);
                if(i < 5) {
                    addUserTable(data[i]);
                }
            }
            if(online_users.length > 5) {
                document.getElementById("next").disabled = false;
                document.getElementById("prev").disabled = false;
            }
            break;

        case "add_user":
            online_users.push(data);
            if(online_users.length > 5) {
                document.getElementById("next").disabled = false;
                document.getElementById("prev").disabled = false;
            }
            addUserTable(data);
            //shuffle(online_users);
            break;

        case "delete_user":
            updateUserTable(data, "offline");
            if(online_users.includes(data))
            {
                index = online_users.indexOf(data);
                online_users.splice(index, 1);
                deleteRequestTable(data);
                currentIndex --;
            }
            break;

        case "ongame_user":
            ongame_users.push(data);
            updateUserTable(data, "on game");
            deleteRequestTable(data);
            currentIndex = 0;
            break;

        case "ongame_list":
            for(let i=0; i<data.length; i++){
                ongame_users.push(data[i]);
            }
            break;

        case "send_request":
            //user_requests.push(sender);
            addReqTable(sender);
            break;

        case "cancel_request":
            //index = user_requests.indexOf(sender);
            //user_requests.splice(index, 1);
            let row = document.getElementById("request_" + sender);
            row.remove();
            break;

        case "accept_request":
            opponent = sender;
            //notifyOnGame();
            location.href = "./battleship.jsp?opponent="+opponent+"&first_turn=true";
            break;

        case "info":
            if(data == "Request correctly accepted!") {
                location.href = "./battleship.jsp?opponent="+opponent+"&first_turn=false";
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

function previousUsers(){

    cleanTable();

    let n = online_users.length;
    let val = currentIndex;
    let start = currentIndex - 5;
    if(online_users.length < 5)
        start = currentIndex - online_users.length;

    for(let i = start; i < val; i++) {
        addUserTable(online_users[(i % n + n) % n]);
        currentIndex = ((i-1) % n + n) % n;
    }
    if(online_users.length <= 5)
    {
        document.getElementById("next").disabled = true;
        document.getElementById("prev").disabled = true;
    }
}

function nextUsers(){

    cleanTable();
    let n = online_users.length;
    let val = currentIndex;

    for(let i = currentIndex; i < val + 5; i++) {
        addUserTable(online_users[(i % n + n) % n]);
        currentIndex = ((i+1) % n + n) % n;
    }
    if(online_users.length <= 5)
    {
        document.getElementById("next").disabled = true;
        document.getElementById("prev").disabled = true;
    }
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function cleanTable(){

    var table = document.getElementById('onlineUsers');
    while(table.rows.length > 0) {
        table.deleteRow(0);
    }
}

function addUserTable(user) {
    let table_body = document.getElementById("onlineUsers");

    if(updateUserTable(user, "online"))
        return;

    if(table_body.rows.length == 5)
        return;
    let tr = document.createElement('tr');
    let td_username = tr.appendChild(document.createElement('td'));
    let td_status = tr.appendChild(document.createElement("td"));
    let img = td_status.appendChild(document.createElement("img"));
    //let td_status = span.appendChild(document.createElement('td'));
    let td_button = tr.appendChild(document.createElement('td'));
    let button = td_button.appendChild(document.createElement("button"));
    //let span = td_status.appendChild(document.createElement("span"));
    let text = document.createTextNode("Online");
    td_status.appendChild(text);
    button.setAttribute("type","button");
    button.setAttribute("id", "button_"+user);
    button.setAttribute("value","sendRequest");
    button.setAttribute("class","buttonRequest");
    button.setAttribute("onclick", "sendRequest(\""+user+"\");");
    //img.setAttribute("src", "./images/online-icon.png");
    img.setAttribute("class", "icon");

    img.src = "./images/online-icon.png";
    //td_status.innerHTML = "Online";
    button.innerHTML = "Send Request";
    td_username.innerHTML = user;
    tr.setAttribute("id", user);
    table_body.appendChild(tr);
}

function updateUserTable(user, type){

    let row = document.getElementById(user);
    if(row == null)
        return false;
    //let text = document.createTextNode("On game");
    if(type == "online")
    {
        row.getElementsByTagName("td")[1].lastChild.nodeValue = "Online";
        row.getElementsByClassName("icon")[0].src = "./images/online-icon.png";
    }
    else if(type == "on game") {
        row.getElementsByTagName("td")[1].lastChild.nodeValue = "On game";
        row.getElementsByClassName("icon")[0].src = "./images/ongame-icon.png";
    }
    else if(type == "offline") {
        row.getElementsByTagName("td")[1].lastChild.nodeValue = "Offline";
        row.getElementsByClassName("icon")[0].src = "./images/offline-icon.png";
    }
    document.getElementById("button_" + user).disabled = true;
    return true;
}

function deleteUserTable(user){
    let row = document.getElementById(user);
    if(row != null)
        row.remove();
}

function deleteRequestTable(user){
    let row = document.getElementById("request_" + user);
    if(row != null)
        row.remove();
}

function deleteRequestDoneTable(user){
    let row = document.getElementById("cancel_" + user);
    if(row != null)
        row.remove();
}

function sendRequest (user) {
    let button = document.getElementById("button_"+user);
    //button.innerHTML = "Cancel Request";
    button.disabled = true;
    addRequestDoneTable(user);
    sendWebSocket(JSON.stringify(new Message("send_request", "", myself, user)));
}

function acceptRequest(user){
    sendWebSocket(JSON.stringify(new Message("accept_request", "", myself, user)));
    opponent = user;
}

function notifyOnGame(){
    sendWebSocket(JSON.stringify(new Message("ongame_user", "", myself, "WebSocket")));
}

function cancelRequest(user){
    let button = document.getElementById("button_"+user);
    //button.innerText = "Send Request";
    button.disabled = false;
    //button.setAttribute("onclick", "sendRequest(\""+user+"\");");
    deleteRequestDoneTable(user);
    sendWebSocket(JSON.stringify(new Message("cancel_request", "", myself, user)));
}

function addRequestDoneTable(user){

    let table_body = document.getElementById("userRequestsDone");

    let tr = document.createElement('tr');
    let td_username = tr.appendChild(document.createElement('td'));
    let td_button = tr.appendChild(document.createElement('td'));
    let button = td_button.appendChild(document.createElement("button"));

    td_username.setAttribute("class","center");
    td_button.setAttribute("class","center");

    button.setAttribute("type","button");
    button.setAttribute("value","acceptRequest");
    button.setAttribute("class","buttonRequest");
    button.setAttribute("onclick", "cancelRequest(\""+user+"\");");

    button.innerHTML = "Cancel Request";
    td_username.innerHTML = user;
    tr.setAttribute("id", "cancel_"+user);
    table_body.appendChild(tr);
}


function addReqTable(user) {
    let table_body = document.getElementById("userRequests");

    let tr = document.createElement('tr');
    let td_username = tr.appendChild(document.createElement('td'));
    let td_button = tr.appendChild(document.createElement('td'));
    let button = td_button.appendChild(document.createElement("button"));

    td_username.setAttribute("class","center");
    td_button.setAttribute("class","center");

    button.setAttribute("type","button");
    button.setAttribute("value","acceptRequest");
    button.setAttribute("class","buttonRequest");
    button.setAttribute("onclick", "acceptRequest(\""+user+"\");");

    button.innerHTML = "Accept Request";
    td_username.innerHTML = user;
    tr.setAttribute("id", "request_"+user);
    table_body.appendChild(tr);
}

function moveUser(user){

    let searchedRow = document.getElementById("searched_" + user);
    searchedRow.remove();
    addUserTable(user);
}

function findUser(){

    /*if(user == myself)
        return;
    */

    if(document.getElementById("userSearch").textContent == myself)
        return;

    let user = document.getElementById("userSearch").textContent;

    let table = document.createElement("table");
    table.setAttribute("id", "searchedUser");

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

    td_username.innerHTML = user;

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