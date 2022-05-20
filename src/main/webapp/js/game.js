// Codice logico del software. Gestisce la creazione degli oggetti
// il cambio di turni e fasi
// gli eventi principali

// Indica il turno di gioco. Se dispari, giocatore 1 di turno
let turn = 1;

// Array di oggetti che indicano lo stato della singola cella della battaglia
// Se lo stato è 0 la cella è vuota
// Se lo stato è 1 sulla cella c'è una nave
// Se lo stato è 2 sulla cella c'è una nave colpita
// Se lo stato è 3 indic mancato
let grid_player1 = [];
let grid_player2 = [];
let grids = [0,grid_player1, grid_player2]; // creato per accesso all'array corretto

// Crea le griglie di entrambi i giocatori
createGrids(100);

// controlla la risoluzione dello schermo e setta il background adeguato
function setBackground(){
    let height = window.screen.height;
    let width = window.screen.width;

    if (height > 1080 || width > 1920)
        document.body.style.backgrounsizeage = "url('../images/background.jpg')";
}

// Funzione per creare 2 griglie array per la battaglia navale
// n è il numero di celle totali (default 100)
function createGrids(n) {
    for (let x = 0; x < n; x++) {
        grid_player1[x] = 0;
        grid_player2[x] = 0;
    }
}

// Restituisce il giocatore attivo, G1 nei turni dispari e G2 nei turni pari
function activePlayer() {
    if (turn%2 === 0)
        return 2;
    else
        return 1;
}

// Restituisce il giocatore non di turno
function opponentPlayer(){
    if (turn%2 == 0)
        return 1;
    else
        return 2;
}


// gestisce il giocatore indicato nell'intestazione della pagina innerHTML
function setPlayer() {
    let activePl = activePlayer();
    document.getElementById("playerTitle").innerHTML = "GIOCATORE " + activePl;
}

// gestisce la creazione delle tabelle a seconda del turno di gioco:
// nei primi due turni di gioco lancia la funzione drawTable in mode 0 altrimenti mode 1 e 2
function drawGrids() {
    if (turn === 1 || turn === 2) {
        drawTable(0);
        setShips();
    }
    else {
        drawTable(1);
        drawTable(2);
    }
}

// funzione che disegna le tabelle:
// mode 0 -> disegna una tabella per il posizionamento
// mode 1 -> una ridotta come reminder della propria griglia
// mode 2 -> disegna una tabella per colpire
function drawTable(mode) {
    // letiabile per indicare giocatore di turno
    let player = activePlayer();
    // letiabile per indicare giocatore avversario
    let opponent = opponentPlayer();
    // Recupero l'array del giocatore di turno
    let active_grid = grids[player];
    // Recuper l'array del giocatore avversario
    let opponent_grid = grids[opponent];
    // Recupero il div nel quale disegnare le tabelle
    let container = document.getElementById("grids");
    row = null;
    cell = null;
    let table = document.createElement("table");
    table.setAttribute("id", "active_table");
    table.setAttribute("class", "grid");
    // imposta il nome del giocatore nell'intestazione
    setPlayer();

    for (let i = 0; i < 10; i++) {
        row = table.insertRow();

        for (let j = 0; j < 10; j++) {
            cell_number = (i*10+j);
            cell = row.insertCell();
            cell.setAttribute("id", cell_number); // assegna alle celle classi differenti a seconda del mode
            id = document.getElementById("grids").className;
            switch (mode) {
                // disegna la griglia per il posizionamento delle navi
                case 0:
                    if (active_grid[cell_number] === 0)
                        cell.setAttribute("class", "empty");
                    else if (active_grid[cell_number] === 1)
                        cell.setAttribute("class", "ship");
                    else if  (active_grid[cell_number] === 2)
                        cell.setAttribute("class", "hit");
                    else if  (active_grid[cell_number] === 3)
                        cell.setAttribute("class", "missed");
                    break;
                case 1:
                    if (active_grid[cell_number] === 0)
                        cell.setAttribute("class", "empty");
                    else if (active_grid[cell_number] === 1)
                        cell.setAttribute("class", "ship");
                    else if  (active_grid[cell_number] === 2)
                        cell.setAttribute("class", "hit");
                    else if  (active_grid[cell_number] === 3)
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

// imposta il messaggio opportuno nella console
function consoleSettingMsg() {
    let con = document.getElementById("console");
    let par = document.createElement("P");

    par.innerHTML = "Place the ships vertically or horizontally, leaving at least one free space between them <br />Press DONE! when you finished.";
    par.setAttribute("class", "console");
    par.setAttribute("id", "console_msg");
    con.appendChild(par);
}

function test_vert(cell, size, grid){
    let row = Math.floor(cell/10);
    let col = cell % 10;

    let test = true;
    if(row+size-1 < 10 && (row==0 || grid[cell-10]==0) &&
        (row==9 || grid[cell+size*10]==0)){
        for(let i=cell-1; i<=cell+1+(size-1)*10; i++){
            if(Math.floor(i/10)<row){
                continue;
            }
            if(grid[i]==1) {
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
    if(row-size+1>0 && (row==0 || grid[cell-10*size]==0) &&
        (row==9 || grid[cell+10]==0)){
        for(let i=cell+1; i>=cell-1-(size-1)*10; i--){
            if(Math.floor(i/10)>row){
                continue;
            }
            if (grid[i] == 1){
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


function test_hor(cell, size, grid){
    let col = cell % 10;

    let test = true;
    if(col+size-1 < 10 && (col==0 || grid[cell-1]==0) &&
        (col==9 || grid[cell+size]==0)){
        for(let i=cell-10; i<=cell+10+size-1; i++){
            if(Math.floor(i/10)<row){
                i=i+9; //perché il for incrementa di 1
                continue;
            }
            if(grid[i]==1){
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
    if(col-size+1>0 && (col==0 || grid[cell-size]==0) &&
        (col==9 || grid[cell+1]==0)){
        for (let i=cell+10; i>=cell-size-9; i--) {
            if(Math.floor(i/10)>row){
                i=i-9; //perché il for decrementa di 1
                continue;
            }
            if (grid[i] == 1){
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
    let player = activePlayer();
    let grid = grids[player];

    while(true) {
        let index = Math.floor(Math.random() * 99);
        let pos = (Math.random() >= 0.5) ? 1 : 0;
        let test;
        switch (pos) {
            case 0: //horizontal
                test = test_hor(index, size, grid);
                if (test == 1) {
                    for (let i = index; i < index + size; i++) {
                        grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                if (test == -1) {
                    for (let i = index; i > index - size; i--) {
                        grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                break;
            case 1: //vertical
                test = test_vert(index, size, grid);
                if (test == 1) {
                    for (let i = index; i < index + size * 10; i = i + 10) {
                        grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                if (test == -1) {
                    for (let i = index; i > index - size * 10; i = i - 10) {
                        grid[i] = 1;
                        let cell = document.getElementById(i.toString());
                        cell.setAttribute("class", "ship");
                    }
                    return;
                }
                break;
        }
    }
}

// gestisce il posizionamento delle navi: modifica l'array e colora la cella corrispondente
function setShips() {
    setShip(5);
    setShip(4);
    setShip(4);
    setShip(3);
    setShip(3);
    setShip(2);
    setShip(2);
    setShip(2);
}

// cancella le griglie visibili
function deleteGrids() {
    //recupera il div contenitore delle griglie
    let tableContainer = document.getElementById("grids");

    tableContainer.innerHTML = "";
}

// gestisce il termine dei turni di setup
function setupDone() {
    let buttonContainer = document.getElementById("buttons");
    //let consoleContainer = document.getElementById("console_msg");

    if (turn === 2) {
        // rimuove le istruzioni di piazzamento al termine del secondo turno
        //consoleContainer.innerHTML = "Colpisci l'avversario utilizzando la griglia di destra. A sinistra hai una miniatura della tua situazione attuale.";
        // rimuove il bottone FATTO
        buttonContainer.removeChild(document.getElementById("button"));

    }
    changeTurn();
}

// gestisce il cambio turno
function changeTurn() {
    // rimuove la griglia attiva
    deleteGrids();
    // cambio turno
    turn ++;

    // diesgna la griglia adatta al turno di gioco
    drawGrids();
}

// funzione per colpire
// Reminder:
// Stato = 0 la cella è vuota
// Stato = 1 sulla cella c'è una nave
// Stato = 2 sulla cella c'è una nave colpita
// Stato = 3 indica mancato
function hit(td) {
    let opponent = opponentPlayer();
    // l'id della cella cliccata funge da indice per l'array
    let cell = td.id;
    let opponent_grid = grids[opponent];
    let flag = 0;

    if (opponent_grid[cell] === 0) {
        opponent_grid[cell] = 3;
        // passa parmetro 0 se la nave è mancata
        showHitMsg(0);
    } else if (opponent_grid[cell] === 1) {
        opponent_grid[cell] = 2;
        // scorre l'array dell'avversario per controllare se ci sono ancora navi non affondate
        for (let i=0; i<100; i++) {
            if (opponent_grid[i] === 1) {
                flag = 1;
            }
        }
        // passa parametro 1 se la nave è colpita ma ci sono ancora navi nella griglia avversaria, 2 altrimenti
        if (flag === 0)
            showHitMsg(2);
        else if (flag === 1)
            showHitMsg(1);
    } else if (opponent_grid[cell] === 2 || opponent_grid[cell] === 3) {
        alert("CASELLA GIÀ COLPITA!");
    }
}


// gestisce il messaggio di feedback dopo un colpo sparato
function showHitMsg(hit){
    let grid_div = document.getElementById("grids");
    //cancella le grilglie e inserisce un div con un paragrafo per il feedback del colpo
    grid_div.innerHTML = "";
    let hit_message_div = document.createElement("DIV");
    let hit_message = document.createElement("P");
    let hit_message_button = document.createElement("A");
    hit_message_div.setAttribute("id", "hit_message_div");
    hit_message.setAttribute("id", "hit_message");
    hit_message_button.setAttribute("id", "hit_message_button");
    hit_message_button.setAttribute("class", "button");
    hit_message_button.innerHTML = "OK";
    hit_message_div.appendChild(hit_message);
    grid_div.appendChild(hit_message_div);
    //se la nave è stata colpita inserisce il testo COLPITO e setta la classe del div per uno sfondo rosso
    if (hit === 1) {
        hit_message_div.setAttribute("class", "hit");
        hit_message.innerHTML = "<h3>Distogli lo sguardo e lascia i comandi al tuo avversario.</h3><h3>Premi OK per cominciare il tuo turno.<br /><br /></h3><h1>NAVE COLPITA!</h1>";
        hit_message_button.setAttribute("onClick", "changeTurn()");
        hit_message_div.appendChild(hit_message_button);
    } else if (hit === 0) {
        hit_message_div.setAttribute("class", "missed");
        hit_message.innerHTML = "<h3>Distogli lo sguardo e lascia i comandi al tuo avversario.</h3><h3>Premi OK per cominciare il tuo turno.<br /><br /></h3><h1>NAVE MANCATA!</h1>";
        hit_message_button.setAttribute("onClick", "changeTurn()");
        hit_message_div.appendChild(hit_message_button);
    } else if (hit === 2) {
        hit_message_div.setAttribute("class", "hit");
        hit_message.innerHTML = "<h1>PARTITA FINITA</h1><h1>GIOCATORE " + activePlayer() + " VINCE!<br /><br /><h3>Premi RICARICA per giocare un'altra partita</h3>";
        // aggiorna la pagina al termine della partia
        hit_message_button.setAttribute("onClick", "location.reload()");
        hit_message_button.innerHTML = "RICARICA";
        hit_message_div.appendChild(hit_message_button);
    }
}
