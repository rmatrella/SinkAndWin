waitForSocketConnection(ws, registerUser);

function registerUser () {
    var username = document.getElementById("loggedUsername").textContent;
    sendWebSocket(JSON.stringify(new Message( "user_registration", "",username, "WebSocket",)));
}


ws.onmessage = function (event) {
    console.log("message received: "+ event.data);
    let data;
    let type;

    //if(typeof event.data === 'jsonString')
    //{
        let jsonString = JSON.parse(event.data);
        type = jsonString.type;
        data = jsonString.data;
    //}
   //else
    //{
      //  type = "other";
        //data = event.data;
    //}
   console.log(type + "; " +  data);

    switch (type){
        case "user_list":
            addUsersTable(data);
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

function addUsersTable(usersList) {

    let table_body = document.getElementById("onlineUsers");
    let empty_row = document.getElementById("emptyRow");


    for(let i = 0; i < data.length; i++) {
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
        td_username.innerHTML = data[i];
        td_score.innerHTML = "0";
        table_body.appendChild(tr);
        console.log(data[i]+"\n");
    }
}