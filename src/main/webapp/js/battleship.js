// Codice logico del software. Gestisce la creazione degli oggetti
// il cambio di turni e fasi
// gli eventi principali

let turn; //if odd it's the challenges turn, if even it's the challenged turn
let move;
let time_left; // time left to the timer
let timer_id; //timer id of the turn timer
let missed_turn = 0; //number of missed consequence turns
let game_ended = false;
let ships_left = 8;

// Array for keep track of the cell status
// 0 empty cell
// 1 cell with ship (only in my_grid)
// 2 hit ship
// 3 missed cell (hitted cell without ship)
let my_grid = [];
let opponent_grid = [];


// Crea le griglie di entrambi i giocatori
createGrids(100);

//change the turn paragraph on the page
function setTurn(){
    let p = document.getElementById("turn");
    if((turn % 2 != 0 && first=="true") || (turn % 2 == 0 && first=="false")) { //is my turn
        p.innerHTML = "It's your turn";
        setTurnTimer(); //starts the timer of the turn
        return;
    }
    else{ //is not my turn
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
        clearInterval(timer_id); //if the timer expired i reset the timer
        timer.innerHTML="";
        move = Math.floor(Math.random() * 99).toString(); //a random move is generate
        missed_turn ++;
        if(missed_turn == 3)
            surrender(); //if i skipped 2 turns i lose the game
        else {
            temporaryDiv("TIME UP!\n Random move: " + move, 1000);
            waitForSocketConnection(ws, sendMove(move)); //send the random move
        }
    }
}

function createGrids(n) {
    for (let x = 0; x < n; x++) { //set all the cell grids to 0 (all is empty)
        my_grid[x] = 0;
        opponent_grid[x] = 0;
    }
}

// check screen resolution and set the proper background image
function setBackground(){
    let height = window.screen.height;
    let width = window.screen.width;

    if (height > 1080 || width > 1920)
        document.body.style.backgrounsizeage = "url('../images/background.jpg')";
}

function setUp() {
    temporaryDiv("Game started with "+ opponent, 1500);
    drawTable(1); //draw table
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

// mode 1 -> draw small grid of my battleground
// mode 2 -> draw grid of opponent's battleground
function drawTable(mode) {

    let container = document.getElementById("grids");
    let row = null;
    let cell = null;
    let table = document.createElement("table");
    table.setAttribute("id", "active_table");
    table.setAttribute("class", "grid");

    for (let i = 0; i < 10; i++) {
        row = table.insertRow();
        for (let j = 0; j < 10; j++) { //add cells of the grid to the page (with the corresponding id)
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

    // set the class to draw it smaller
    if (mode == 1)
        table.setAttribute("class", "miniature");

    let new_div = document.createElement("DIV");
    new_div.setAttribute("id", "grid" + mode);
    new_div.setAttribute("class", "grids");
    new_div.appendChild(table);
    container.appendChild(new_div);
}

//test if the ship can be set vertically
function test_vert(cell, size){
    let row = Math.floor(cell/10);
    let col = cell % 10;

    let test = true;
    //check position going down
    //check if the starting cell is empty and if the ship dimension fit in the grid
    if(row+size-1 < 10 && (row==0 || my_grid[cell-10]==0) &&
        (row==9 || my_grid[cell+size*10]==0)){
        for(let i=cell-1; i<=cell+1+(size-1)*10; i++){ //check the rectangular along the ship position
            if(Math.floor(i/10)<row){
                continue;
            }
            if(my_grid[i]==1) { // if i found a 1 i can't set the ship
                test = false;
                break;
            }
            if(i%10==(col+1)%10) //jump to the next row
                i=i+9-size;
        }
    } else {
        test = false;
    }
    if(test == true) {
        return 1;
    }

    //if the prev test failed, check position going up
    //check if the starting cell is empty and if the ship dimension fit in the grid
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

//test if the ship can be set horizontally
function test_hor(cell, size){
    let col = cell % 10;

    let test = true;
    //check position going right
    //check if the starting cell is empty and if the ship dimension fit in the grid
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

    //if the prev test failed, check position going left
    //check if the starting cell is empty and if the ship dimension fit in the grid
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

//set a ship with dimension = size
function setShip(size){
    while(true) {
        let index = Math.floor(Math.random() * 99); //starting index
        let pos = (Math.random() >= 0.5) ? 1 : 0; //if 0 i test horizontally, if 1 vertically
        let test;
        switch (pos) { //i try until i found a correct position
            case 0: //horizontal
                test = test_hor(index, size);
                if (test == 1) { //if 1 set ship going right
                    for (let i = index; i < index + size; i++) {
                        my_grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                if (test == -1) { //if -1 set ship going left
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
                if (test == 1) { //if 1 set ship going up
                    for (let i = index; i < index + size * 10; i = i + 10) {
                        my_grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                if (test == -1) {   //if 1 set ship going down
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

// delete grids from page
function deleteGrids() {
    let tableContainer = document.getElementById("grids");

    tableContainer.innerHTML = "";
}

//hit a cell
function hit(cell) {
    if((turn % 2 == 0 && first=="true") || (turn % 2 != 0 && first=="false")) { //is not my turn
        temporaryDiv("Wait your turn", 1000);
        return;
    }
    clearInterval(timer_id); //clear interval because the player made a move
    let timer = document.getElementById("timer");
    timer.innerHTML="";
    move = cell.id;
    missed_turn = 0;
    waitForSocketConnection(ws, sendMove(move)); //send move
}

//update opponent's grid based on the received reply
function receiveReply(reply){
    if(move==null || game_ended == true)
        return;
    let cell = document.getElementById(move);

    switch(reply){ //set the correct value inside the cell and display message
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
            let dim = checkSunkDim(move);
            let count = document.getElementById("dim_"+dim).textContent;
            document.getElementById("dim_"+dim).textContent = count-1;
            break;
        case "win":
            showMoveMsg(3);
            game_ended = true;
            break;
    }
    move = null;
}

function changeTurn() {
    deleteGrids();

    turn ++;

    drawTable(1);
    drawTable(2);
    setTurn();
}

//check the hitted cell and prepare message reply
function checkReply(cell){
    let message;
    if(my_grid[cell]==0 || my_grid[cell]==3) {
        my_grid[cell] = 3;
        message = "missed";
    }
    if(my_grid[cell]==1) {
        my_grid[cell]=2;
        let win = 1;

        for(let i=0; i<100; i++){ //i check if remain other ships
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
            let sunk = checkSunkShip(cell); //check if i sunk the ship
            if(sunk==1){
                message = "sunk";
            }
            else
                message = "hit";
        }
    }
    waitForSocketConnection(ws, sendMoveReply(message));
    changeTurn();
}

function checkSunkDim(cell) {

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

// show the correct message based on the reply
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
        ships_left --;
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


