// Codice logico del software. Gestisce la creazione degli oggetti
// il cambio di turni e fasi
// gli eventi principali

// Indica il turno di gioco. Se dispari, giocatore 1 di turno
let turn;
let move;

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
    console.log("first_turn: "+first);
    let p = document.getElementById("turn");
    if((turn % 2 != 0 && first=="true") || (turn % 2 == 0 && first=="false")) { //is not my turn
        p.innerHTML = "It's your turn";
        return;
    }
    else{
        p.innerHTML = "Opponent's turn";
        return;
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
    alert("Game started!");
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
                // disegna la griglia per il posizionamento delle navi
                case 0:
                    if (my_grid[cell_number] === 0)
                        cell.setAttribute("class", "empty");
                    else if (my_grid[cell_number] === 1)
                        cell.setAttribute("class", "ship");
                    else if  (my_grid[cell_number] === 2)
                        cell.setAttribute("class", "hit");
                    else if  (my_grid[cell_number] === 3)
                        cell.setAttribute("class", "missed");
                    break;
                case 1:
                    if (my_grid[cell_number] === 0)
                        cell.setAttribute("class", "empty");
                    else if (my_grid[cell_number] === 1)
                        cell.setAttribute("class", "ship");
                    else if  (my_grid[cell_number] === 2)
                        cell.setAttribute("class", "hit");
                    else if  (my_grid[cell_number] === 3)
                        cell.setAttribute("class", "missed");
                    break;
                // disegna la griglia dell'avversario per colpire
                case 2:
                    if (opponent_grid[cell_number] === 0 || opponent_grid[cell_number] === 1) {
                        cell.setAttribute("class", "unknown");
                        cell.setAttribute("onClick", "hit(this)");
                    }
                    else if  (opponent_grid[cell_number] === 2)
                        cell.setAttribute("class", "hit");
                    else if  (opponent_grid[cell_number] === 3)
                        cell.setAttribute("class", "missed");
                    break;
            }
        }
    }

    // miniaturizza la tabella se mode = 1
    if (mode === 1)
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
        (row==9 || my_grid[cell+10]==0)){
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
        alert("Wait your turn");
        return;
    }

    move = cell.id;
    //invio la mia mossa
    waitForSocketConnection(ws, sendMove(move));
}

function moveReply(reply){
    if(move==null)
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
        case "win":
            showMoveMsg(2);
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
    if(my_grid[cell]===0)
        message = "missed";
    if(my_grid[cell]===1) {
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
            alert(opponent + " win\nPress ok to continue..");
            showMoveMsg(3);
        }
        else
            message = "hit";
    }
    waitForSocketConnection(ws, sendMoveReply(message));
    changeTurn();
}

// gestisce il messaggio di feedback dopo un colpo sparato
function showMoveMsg(hit){
    let grid_div = document.getElementById("grids");
    grid_div.innerHTML="";

    let message_div = document.createElement("div");
    let message = document.createElement("p");
    let message_button = document.createElement("a");
    message_div.setAttribute("id", "hit_message_div");
    message.setAttribute("id", "hit_message");
    message_button.setAttribute("id", "hit_message_button");
    message_button.setAttribute("class", "button");
    message_button.innerHTML = "OK";
    message_div.appendChild(message);
    grid_div.appendChild(message_div);
    //se la nave è stata colpita inserisce il testo COLPITO e setta la classe del div per uno sfondo rosso
    if (hit === 1) {
        message_div.setAttribute("class", "hit");
        message_button.setAttribute("onClick", "changeTurn()");
        message.innerHTML = "<h1>NAVE COLPITA!</h1>";
        message_div.appendChild(message_button);
    } else if (hit === 0) {
        message_div.setAttribute("class", "missed");
        message_button.setAttribute("onClick", "changeTurn()");
        message.innerHTML = "<h1>NAVE MANCATA!</h1>";
        message_div.appendChild(message_button);
    } else if (hit === 2 || hit===3) {
        message_div.setAttribute("class", "hit");
        if(hit===2) {
            message.innerHTML = "<h1>PARTITA FINITA</h1><h1>GIOCATORE "+ myself+ " VINCE!<br /><br /><h3>Premi NUOVA PARTITA per scegliere un nuovo sfidante</h3>";
        }
        else {
            message.innerHTML = "<h1>PARTITA FINITA</h1><h1>GIOCATORE "+ opponent + " VINCE!<br /><br /><h3>Premi NUOVA PARTITA per scegliere un nuovo sfidante</h3>";
            window.location.href = "../chooseOpponent.jsp";
        }

        message_button.setAttribute("onClick", "window.location.href = \"../chooseOpponent.jsp\";");
        message_button.innerHTML = "NUOVA PARTITA";
        message_div.appendChild(message_button);

    }
}
