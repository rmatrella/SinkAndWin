waitForSocketConnection(ws, registerUser);

function registerUser () {
    let username = document.getElementById("loggedUsername").textContent;
    let points = document.getElementById("hidden").textContent;
    console.log(JSON.stringify(new Message( "user_registration", points,username, "WebSocket")));
    sendWebSocket(JSON.stringify(new Message( "user_registration", points,username, "WebSocket")));
}

function logoutUser(){
    let username = document.getElementById("loggedUsername").textContent;
    sendWebSocket(JSON.stringify(new Message( "user_logout", "",username, "WebSocket",)));
}


ws.onmessage = function (event) {
    console.log("message received: "+ event.data);

    let jsonString = JSON.parse(event.data);
    let type = jsonString.type;
    let data = jsonString.data;

   console.log(type + "; " +  data);

    switch (type){
        case "user_list":
            console.log("user_list");
            console.log("DATA: " + data[0]);
            for(let i = 0; i < data.length/2 && i < 5; i++)
                addUsersTable(data[i], 0);
            break;

        case "add_user":
            addUsersTable(data[0], data[1]);
            break;

        case "info":
            alert(data);
            break;

        case "error":
            alert(data);
            //location.href = "./logout-servlet";
            break;

        default:
            break;
    }
}

function addUsersTable(username, points) {

    let table_body = document.getElementById("onlineUsers");
    let empty_row = document.getElementById("emptyRow");

        console.log("USERS: " + username);

        empty_row.remove();
        let tr = document.createElement('tr');
        let td_username = tr.appendChild(document.createElement('td'));
        let td_status = tr.appendChild(document.createElement('td'));
        let td_score = tr.appendChild(document.createElement('td'));
        let td_button = tr.appendChild(document.createElement('td'));
        let button = td_button.appendChild(document.createElement("button"));
        let span = td_status.appendChild(document.createElement("span"));
        let img = span.appendChild(document.createElement("img"));

        button.setAttribute("tye","button");
        button.setAttribute("value","sendRequest");
        button.setAttribute("class","buttonRequest");
        img.setAttribute("src", "./images/online-icon.png");
        img.setAttribute("className", "icon");

        td_status.innerHTML = "Online";
        button.innerHTML = "Send Request";
        td_username.innerHTML = username;
        td_score.innerHTML = password;
        table_body.appendChild(tr);
}
