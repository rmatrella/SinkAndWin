let online_users = new Array();
let user_requests = new Array();
let ongame_users = new Array();
let myself;
let opponent;

ws.onmessage = function (event) {
    console.log("message received: "+ event.data);

    let jsonString = JSON.parse(event.data);
    let type = jsonString.type;
    let data = jsonString.data;
    let sender = jsonString.sender;

    switch (type){
        case "user_list":
            for(let i=0; i<data.length; i++){
                online_users.push(data[i]);
                addUserTable(data[i]);
            }
            break;

        case "add_user":
            addUserTable(data);
            break;

        case "delete_user":

            let i = online_users.indexOf(data);
            online_users.splice(i);
            deleteUserTable(data);
            break;

        case "send_request":
            user_requests.push(sender);
            addReqTable(sender);
            break;

        case "accept_request":
            alert("request accepted by " + sender);
            opponent = sender;
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
    let empty_row = document.getElementById("emptyRow");
    if(empty_row != null)
        empty_row.remove();

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
    img.setAttribute("className", "icon");

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