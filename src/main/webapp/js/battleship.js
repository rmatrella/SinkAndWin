// Codice logico del software. Gestisce la creazione degli oggetti
// il cambio di turni e fasi
// gli eventi principali

// Indica il turno di gioco. Se dispari, giocatore 1 di turno
let turn;
let move;
let time_left; // istante d'inizio del timer
let timer_id;
let missed_turn = 0;
let game_ended = false;
let ships_left = 8;

// Array di oggetti che indicano lo stato della singola cella della battaglia
// Se lo stato è 0 la cella è vuota
// Se lo stato è 1 sulla cella c'è una nave
// Se lo stato è 2 sulla cella c'è una nave colpita
// Se lo stato è 3 indice mancato
let my_grid = [];
let opponent_grid = [];


// Crea le griglie di entrambi i giocatori
createGrids(100);

function setTurn(){
    let p = document.getElementById("turn");
    if((turn % 2 != 0 && first=="true") || (turn % 2 == 0 && first=="false")) { //is not my turn
        p.innerHTML = "It's your turn";
        setTurnTimer();
        return;
    }
    else{
        p.innerHTML = opponent+"'s turn";
        return;
    }
}

function setTurnTimer(){
    time_left = 30;
    timer_id = setInterval(updateTimer, 1000);

}

function updateTimer(){
    time_left--;
    let timer = document.getElementById("timer");

    if(time_left > 0) {
        if(time_left<10)
            timer.innerHTML = "0:0" + time_left;
        else
            timer.innerHTML = "0:" + time_left;
    }
    else {
        clearInterval(timer_id);
        timer.innerHTML="";
        move = Math.floor(Math.random() * 99).toString();
        missed_turn ++;
        if(missed_turn == 3)
            surrender();
        else {
            temporaryDiv("TIME UP!\n Random move: " + move, 1000);
            waitForSocketConnection(ws, sendMove(move));
        }
    }
}

// Funzione per creare 2 griglie array per la battaglia navale
// n è il numero di celle totali (default 100)
function createGrids(n) {
    for (let x = 0; x < n; x++) {
        my_grid[x] = 0;
        opponent_grid[x] = 0;
    }
}

// controlla la risoluzione dello schermo e setta il background adeguato
function setBackground(){
    let height = window.screen.height;
    let width = window.screen.width;

    if (height > 1080 || width > 1920)
        document.body.style.backgrounsizeage = "url('../images/background.jpg')";
}

function setUp() {
    temporaryDiv("Game started with "+ opponent, 1500);
    drawTable(1);
    drawTable(2);

    setShip(5);
    setShip(4);
    setShip(4);
    setShip(3);
    setShip(3);
    setShip(2);
    setShip(2);
    setShip(2);

    turn = 1;
    setTurn();
}

// funzione che disegna le tabelle:
// mode 0 -> disegna una tabella per il posizionamento
// mode 1 -> una ridotta come reminder della propria griglia
// mode 2 -> disegna una tabella per colpire
function drawTable(mode) {

    let container = document.getElementById("grids");
    let row = null;
    let cell = null;
    let table = document.createElement("table");
    table.setAttribute("id", "active_table");
    table.setAttribute("class", "grid");
    // imposta il nome del giocatore nell'intestazione

    for (let i = 0; i < 10; i++) {
        row = table.insertRow();

        for (let j = 0; j < 10; j++) {
            let cell_number = (i*10+j);
            cell = row.insertCell();
            cell.setAttribute("id", cell_number.toString());

            switch (mode) {
                case 1:
                    if (my_grid[cell_number] == 0)
                        cell.setAttribute("class", "empty");
                    else if (my_grid[cell_number] == 1)
                        cell.setAttribute("class", "ship");
                    else if  (my_grid[cell_number] == 2)
                        cell.setAttribute("class", "hit");
                    else if  (my_grid[cell_number] == 3)
                        cell.setAttribute("class", "missed");
                    break;
                // disegna la griglia dell'avversario per colpire
                case 2:
                    if (opponent_grid[cell_number] == 0 || opponent_grid[cell_number] == 1) {
                        cell.setAttribute("class", "unknown");
                        cell.setAttribute("onClick", "hit(this)");
                    }
                    else if  (opponent_grid[cell_number] == 2)
                        cell.setAttribute("class", "hit");
                    else if  (opponent_grid[cell_number] == 3)
                        cell.setAttribute("class", "missed");
                    break;
            }
        }
    }

    // miniaturizza la tabella se mode = 1
    if (mode == 1)
        table.setAttribute("class", "miniature");

    let new_div = document.createElement("DIV");
    new_div.setAttribute("id", "grid" + mode);
    new_div.setAttribute("class", "grids");
    new_div.appendChild(table);
    container.appendChild(new_div);
}

function test_vert(cell, size){
    let row = Math.floor(cell/10);
    let col = cell % 10;

    let test = true;
    if(row+size-1 < 10 && (row==0 || my_grid[cell-10]==0) &&
        (row==9 || my_grid[cell+size*10]==0)){
        for(let i=cell-1; i<=cell+1+(size-1)*10; i++){
            if(Math.floor(i/10)<row){
                continue;
            }
            if(my_grid[i]==1) {
                test = false;
                break;
            }
            if(i%10==(col+1)%10)
                i=i+9-size;
        }
    } else {
        test = false;
    }
    if(test == true) {
        return 1;
    }

    test = true;
    if(row-size+1>0 && (row==0 || my_grid[cell-10*size]==0) &&
        (row==9 || my_grid[cell+30]==0)){
        for(let i=cell+1; i>=cell-1-(size-1)*10; i--){
            if(Math.floor(i/10)>row){
                continue;
            }
            if (my_grid[i] == 1){
                test = false;
                break;
            }
            if(i%10==(col-1)%10)
                i=i-9+size;
        }
    } else{
        test = false;
    }
    if(test == true) {
        return -1;
    }

    return 0;
}

function test_hor(cell, size){
    let col = cell % 10;

    let test = true;
    if(col+size-1 < 10 && (col==0 || my_grid[cell-1]==0) &&
        (col==9 || my_grid[cell+size]==0)){
        for(let i=cell-10; i<=cell+10+size-1; i++){
            if(Math.floor(i/10)<0){
                i=i+9; //perché il for incrementa di 1
                continue;
            }
            if(my_grid[i]==1){
                test = false;
                break;
            }
            if(i%10==(col+size-1))
                i = i + 10 - size; //aggiungo uno in meno perché il for incrementa
        }
    } else {
        test = false;
    }
    if(test == true) {
        return 1;
    }

    test = true;
    if(col-size+1>0 && (col==0 || my_grid[cell-size]==0) &&
        (col==9 || my_grid[cell+1]==0)){
        for (let i=cell+10; i>=cell-size-9; i--) {
            if(Math.floor(i/10)>9){
                i=i-9; //perché il for decrementa di 1
                continue;
            }
            if (my_grid[i] == 1){
                test = false;
                break;
            }
            if(i%10==(col-size+1)%10)
                i=i-10+size;
        }
    } else{
        test = false;
    }
    if(test == true) {
        return -1;
    }

    return 0;
}

function setShip(size){

    while(true) {
        let index = Math.floor(Math.random() * 99);
        let pos = (Math.random() >= 0.5) ? 1 : 0;
        let test;
        switch (pos) {
            case 0: //horizontal
                test = test_hor(index, size);
                if (test == 1) {
                    for (let i = index; i < index + size; i++) {
                        my_grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                if (test == -1) {
                    for (let i = index; i > index - size; i--) {
                        my_grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                break;
            case 1: //vertical
                test = test_vert(index, size);
                if (test == 1) {
                    for (let i = index; i < index + size * 10; i = i + 10) {
                        my_grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                if (test == -1) {
                    for (let i = index; i > index - size * 10; i = i - 10) {
                        my_grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                break;
        }
    }
}


// cancella le griglie visibili
function deleteGrids() {
    //recupera il div contenitore delle griglie
    let tableContainer = document.getElementById("grids");

    tableContainer.innerHTML = "";
}

// funzione per colpire
// Reminder:
// Stato = 0 la cella è vuota
// Stato = 1 sulla cella c'è una nave
// Stato = 2 sulla cella c'è una nave colpita
// Stato = 3 indica mancato
function hit(cell) {
    if((turn % 2 == 0 && first=="true") || (turn % 2 != 0 && first=="false")) { //is not my turn
        temporaryDiv("Wait your turn", 1000);
        return;
    }
    clearInterval(timer_id);
    let timer = document.getElementById("timer");
    timer.innerHTML="";
    move = cell.id;
    missed_turn = 0;
    waitForSocketConnection(ws, sendMove(move));
}

function moveReply(reply){
    if(move==null || game_ended == true)
        return;
    let cell = document.getElementById(move);

    switch(reply){
        case "hit":
            opponent_grid[move] = 2;
            cell.setAttribute("class", "hit");
            showMoveMsg(1);
            break;
        case "missed":
            opponent_grid[move] = 3;
            cell.setAttribute("class", "missed");
            showMoveMsg(0);
            break;
        case "sunk":
            opponent_grid[move] = 2;
            cell.setAttribute("class", "hit");
            showMoveMsg(2);
            let dim = checkSunkShipType(move);
            let quanti = document.getElementById("dim_"+dim).textContent;
            document.getElementById("dim_"+dim).textContent = quanti-1;
            break;
        case "win":
            showMoveMsg(3);
            game_ended = true;
            break;
    }
    move = null;
}

// gestisce il cambio turno
function changeTurn() {
    deleteGrids();

    turn ++;

    drawTable(1);
    drawTable(2);
    setTurn();
}

function checkCell(cell, player){
    let message;
    if(my_grid[cell]==0 || my_grid[cell]==3) {
        my_grid[cell] = 3;
        message = "missed";
    }
    if(my_grid[cell]==1) {
        my_grid[cell]=2;
        let win = 1;

        for(let i=0; i<100; i++){
            if(my_grid[i] == 1) {
                win = 0;
                break;
            }
        }
        if(win==1) {
            message = "win";
            showMoveMsg(4);
            waitForSocketConnection(ws, sendMoveReply(message));
            game_ended = true;
            return;
        }
        else {
            let sunk = checkSunkShip(cell);
            if(sunk==1){
                message = "sunk";
                ships_left--;
            }
            else
                message = "hit";
        }
    }
    waitForSocketConnection(ws, sendMoveReply(message));
    changeTurn();
}

function checkSunkShipType(cell) {

    let dim = 1;
    cell = parseInt(cell);

    if (opponent_grid[cell - 10] == 2)
    {
        for (let i = (cell-10); Math.floor(i / 10) >= 0 && opponent_grid[i] == 2; i = i - 10) //check up
        {
            dim++;
        }
    }
    if (opponent_grid[cell + 10] == 2)
    {
        for (let i = (cell+10); Math.floor(i / 10) <= 9 && opponent_grid[i] == 2 ; i = i + 10) {
            dim++;
        }
    }
    if (opponent_grid[cell - 1] == 2)
    {
        for(let i= (cell-1); i%10 >= 0 && opponent_grid[i] == 2 ;i--) {
            dim++;
        }
    }
    if (opponent_grid[cell + 1] == 2)
    {
        for(let i= (cell+1); i%10 <= 9 && opponent_grid[i] ==2 ;i++) {
            dim++;
        }
    }

    return dim;
}

function checkSunkShip(cell){
    let sunk = 1;
    cell = parseInt(cell);

    for(let i=cell; Math.floor(i/10)>=0 && my_grid[i]!=0 && my_grid[i]!=3 ;i = i -10) { //check up
        if (my_grid[i] == 1){
            sunk=0;
            return sunk;
        }
    }
    for(let i=cell; Math.floor(i/10)<=9 && my_grid[i]!=0 && my_grid[i]!=3 ;i= i + 10) { //check down
        if (my_grid[i] == 1){
            sunk=0;
            return sunk;
        }
    }
    for(let i=cell; i%10 >= 0 && my_grid[i]!=0 && my_grid[i]!=3 ;i--) { //check left
        if (my_grid[i] == 1){
            sunk=0;
            return sunk;
        }
    }
    for(let i=cell; i%10 <= 9 && my_grid[i]!=0 && my_grid[i]!=3 ;i++) { //check right
        if (my_grid[i] == 1){
            sunk=0;
            return sunk;
        }
    }
    return sunk;
}

// gestisce il messaggio di feedback dopo un colpo sparato
function showMoveMsg(hit){
    if(game_ended == true)
        return;
    let grid_div = document.getElementById("grids");
    grid_div.innerHTML="";

    let message_div = document.createElement("div");
    let message = document.createElement("p");
    message_div.setAttribute("id", "message_div");
    message.setAttribute("id", "message");
    message_div.appendChild(message);
    grid_div.appendChild(message_div);
    if(hit == 0){ //missed ship
        message_div.setAttribute("class", "missed");
        message.innerHTML = "<h1>MISSED SHIP!</h1>";
        setTimeout(changeTurn, 1000);
    }
    else if (hit == 1) { //hit ship
        message_div.setAttribute("class", "hit");
        message.innerHTML = "<h1>SHIP HIT!</h1>";
        setTimeout(changeTurn, 1000);
    }
    else if (hit == 2) { //hit and sunk ship
        message_div.setAttribute("class", "hit");
        message.innerHTML = "<h1>SHIP HIT AND SUNK!</h1>";
        setTimeout(changeTurn, 1000);
    }else{ //game ended
        clearInterval(timer);
        let button = document.createElement("a");
        button.setAttribute("id", "hit_message_button");
        button.setAttribute("class", "button");
        button.innerHTML = "NEW GAME!";
        message_div.setAttribute("class", "hit");
        if(hit==3 || hit ==6) { // I win (case 3 normal win, case 6 opponent has surrendered
            message.innerHTML = "<h1>END GAME</h1><h1>PLAYER "+ myself+ " WINS!<br /><br /><h3>Click NEW GAME to choose another opponent</h3>";
            button.setAttribute("href", "UpdatePointsServlet?winner="+myself+"&l_ships=0");
        }
        else if(hit == 4) { //opponent wins
            message.innerHTML = "<h1>END GAME</h1><h1>PLAYER "+ opponent + " WINS!<br /><br /><h3>Click NEW GAME to choose another opponent</h3>";
            button.setAttribute("href", "UpdatePointsServlet?winner="+opponent+"&l_ships="+ships_left);
        }
        else if(hit == 5) {
            message.innerHTML = "<h1>END GAME</h1><h1>YOU HAVE SURRENDER!<br /><br /><h3>Click NEW GAME to choose another opponent</h3>";
            button.setAttribute("href", "UpdatePointsServlet?winner=" + opponent+"&l_ships="+ships_left);
        }
        else if(hit == 7) {
            message.innerHTML = "<h1>END GAME</h1><h1>PLAYER "+ opponent + " DISCONNECTED! YOU WIN!<br /><br /><h3>Click NEW GAME to choose another opponent</h3>";
            button.setAttribute("href", "UpdatePointsServlet?winner="+myself+"&l_ships=0");
        }

        clearInterval(timer_id);
        grid_div.appendChild(button);
    }
}

function temporaryDiv(message, time){
    let div = document.getElementById("alert");
    div.setAttribute("class", "alert");
    div.innerHTML = message;

    setTimeout(cancelDiv, time);
}
function cancelDiv() {
    let div = document.getElementById("alert");
    div.setAttribute("class", "hidden");
    div.innerHTML = "";
}
function surrender() {
    let opponent = document.getElementById("opponentUsername").textContent;
    let username = document.getElementById("loggedUsername").textContent;
    sendWebSocket(JSON.stringify(new Message("surrender", "", username, opponent)));
    showMoveMsg(5);
    game_ended = true;
    //setTimeout(function (){location.href = "UpdatePointsServlet?winner="+opponent}, 3000);
}


