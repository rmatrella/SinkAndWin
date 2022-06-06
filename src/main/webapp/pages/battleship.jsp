<!doctype html>
<html lang="eng">
<head>
    <title>Battleship</title>
    <link rel="stylesheet" type="text/css" href="../css/game.css">
    <meta charset="utf-8" />
    <script src="../js/websocket.js?version=51"></script>
    <script src="../js/game_requests.js?version=51"></script>
    <script type="text/javascript" src="../js/battleship.js?version=51"></script>
</head>

<body>
<%
    String username = request.getParameter("myself");
    String opponent = request.getParameter("opponent");
    String first_turn = request.getParameter("first_turn");
%>
<div id="main_container">  <!-- Inizio contenitore principale -->

    <div id="title">  <!-- Inizio titolo -->
        <h1 class="center">Sink And Win!</h1>
    </div>  <!-- Fine titolo -->

    <div id="player">  <!-- Inizio giocatore -->
        <button id="surrender" onclick="surrender();"> Surrender </button>
        <h3 id="loggedUsername"><%=username%></h3>
        <h2 id="turn"></h2>
        <h3 id="timer"></h3>
        <p id="opponentUsername" style="visibility: hidden;"><%=opponent%></p>
        <p id="firstTurn" style="visibility: hidden;"><%=first_turn%></p>
    </div>
    <script> waitForSocketConnection(ws, registerUser);</script>
    <div id="alert"></div>
    <div id="grids"> <!-- Inizio GRIGLIE create dinamicamente da JS-->
    </div>  <!-- Fine GRIGLIE -->

    <div id="console" class="console"> <!-- Inizio CONSOLE -->

        <table class="console">
            <tr>
                <th>#</th>
                <th>Ship type</th>
                <th>Dimension</th>
                <th>Ships left</th>
            </tr>
            <tr>
                <td>1</td>
                <td>Portaerei</td>
                <td>5</td>
                <td id="dim_5">1</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Corazzate</td>
                <td>4</td>
                <td id="dim_4">2</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Sottomarini</td>
                <td>3</td>
                <td id="dim_3">2</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Incrociatori</td>
                <td>2</td>
                <td id="dim_2">3</td>
            </tr>
        </table>

    </div> <!-- Fine terminali -->

</div> <!-- Fine contenitore principale -->

</body>

<!-- controlla la risoluzione dello schermo e setta il background adeguato -->
<script>setBackground()</script>

</html>