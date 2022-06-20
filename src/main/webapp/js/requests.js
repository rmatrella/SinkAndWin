let online_users = [];
let ongame_users = [];
let myself;
let opponent;
let currentIndex = 0;

//sending of register message to the server
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

    switch (type){

        case "user_list":  //receiving of the online users list
            shuffle(data);
            for(let i=0; i<data.length; i++){ //inserting online users into the array
                online_users.push(data[i]);
                if(i < 5) {
                    addUserTable(data[i]); //adding users to the table
                }
            }
            if(online_users.length > 5) { //if users more than 5, enable buttons
                document.getElementById("next").disabled = false;
                document.getElementById("prev").disabled = false;
            }
            break;

        case "add_user": //new user online
            online_users.push(data); //adding into online users array
            if(online_users.length > 5) {
                document.getElementById("next").disabled = false;
                document.getElementById("prev").disabled = false;
            }
            addUserTable(data); //adding to the table of online users
            //shuffle(online_users);
            break;

        case "delete_user": //user logs out
            updateUserTable(data, "offline"); //putting him offline into the table
            if(online_users.includes(data))
            {
                let index = online_users.indexOf(data);
                online_users.splice(index, 1); //remove from online users
                deleteRequestTable(data); //delete all the requests coming from the user
                currentIndex --;
            }
            break;

        case "ongame_user": //a user starts gaming
            ongame_users.push(data); //inserting user in ongame array
            updateUserTable(data, "on game"); //update user inside the table
            deleteRequestTable(data); //delete all his game requests
            currentIndex = 0;
            break;

        /*case "ongame_list": //
            for(let i=0; i<data.length; i++){
                ongame_users.push(data[i]);
            }
            break;
        */
        case "send_request": //sending game request
            addReqTable(sender); //adding request into request table
            break;

        case "cancel_request": //cancel game request
            let row = document.getElementById("request_" + sender);
            row.remove(); //remove from the request table
            break;

        case "accept_request": //accept game request
            opponent = sender;
            location.href = "./battleship.jsp?opponent="+opponent+"&first_turn=true"; //redirect to the game page
            break;

        case "info":
            if(data === "Request correctly accepted!") {
                location.href = "./battleship.jsp?opponent="+opponent+"&first_turn=false";
            }
            break;

        case "error":
            alert(data);
            location.href ="./index.jsp";
            break;

        default:
            break;
    }
}

//shows the previous online users with ring array
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
//shows the next online users with ring array
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

//randomize the users orders into array in order to show them equally
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

//remove all element from online users table
function cleanTable(){

    let table = document.getElementById('onlineUsers');
    while(table.rows.length > 0) {
        table.deleteRow(0);
    }
}
//add user to the online user table
function addUserTable(user) {
    let table_body = document.getElementById("onlineUsers");

    if(updateUserTable(user, "online"))
        return;

    if(table_body.rows.length === 5)
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
    img.setAttribute("class", "icon");

    img.src = "./images/online-icon.png";
    button.innerHTML = "Send Request";
    td_username.innerHTML = user;
    tr.setAttribute("id", user);
    table_body.appendChild(tr);
}

//updates the table in case a user in the table becomes online, ongame or offline
function updateUserTable(user, type){

    let row = document.getElementById(user);
    if(row == null)
        return false;

    let button = document.getElementById("button_" + user);
    if(type === "online")
    {
        row.getElementsByTagName("td")[1].lastChild.nodeValue = "Online";
        row.getElementsByClassName("icon")[0].src = "./images/online-icon.png";
        button.disabled = false;
        button.hidden = false;
    }
    else if(type === "on game") {
        row.getElementsByTagName("td")[1].lastChild.nodeValue = "On game";
        row.getElementsByClassName("icon")[0].src = "./images/ongame-icon.png";
        button.disabled = true;
        button.hidden = true;
    }
    else if(type === "offline") {
        row.getElementsByTagName("td")[1].lastChild.nodeValue = "Offline";
        row.getElementsByClassName("icon")[0].src = "./images/offline-icon.png";
        button.disabled = true;
        button.hidden = true;
    }
    return true;
}
//removes all the requests to a specific user
function deleteRequestTable(user){
    let row = document.getElementById("request_" + user);
    if(row != null)
        row.remove();
}
//removes all the requests made from a specific user
function deleteRequestDoneTable(user){
    let row = document.getElementById("cancel_" + user);
    if(row != null)
        row.remove();
}
//sends game request to another user and adds it to the request table
function sendRequest (user) {
    let button = document.getElementById("button_"+user);
    button.disabled = true;
    addRequestDoneTable(user);
    sendWebSocket(JSON.stringify(new Message("send_request", "", myself, user)));
}
//acccepts a request from another user
function acceptRequest(user){
    sendWebSocket(JSON.stringify(new Message("accept_request", "", myself, user)));
    opponent = user;
}
//removes the request, after clicking the delete request button and removes the request from the request done table
function cancelRequest(user){

    let button = document.getElementById("button_"+user);
    button.disabled = false;
    deleteRequestDoneTable(user);
    sendWebSocket(JSON.stringify(new Message("cancel_request", "", myself, user)));
}
//adds a request done to another user to the request done table
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
//adds a request to the request table
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

