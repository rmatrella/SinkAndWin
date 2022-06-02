let online_users = new Array();
let user_requests = new Array();
let ongame_users = new Array();
let myself;
let opponent;

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