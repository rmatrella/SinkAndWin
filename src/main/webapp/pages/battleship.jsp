<%--
  Created by IntelliJ IDEA.
  User: luanabussu
  Date: 19/05/22
  Time: 21:30
  To change this template use File | Settings | File Templates.
--%>
<%@ page import="it.unipi.dsmt.dto.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="eng">
<head>
    <title>Battleship</title>
    <link rel="stylesheet" type="text/css" href="../css/game.css">
    <meta charset="utf-8" />
    <script src="../js/websocket.js"></script>
    <script src="../js/game_requests.js"></script>
    <script type="text/javascript" src="../js/battleship.js"></script>
</head>

<body>
<%
    String username = ((User)session.getAttribute("logUser")).getUsername();
    String opponent = request.getParameter("opponent");
    String first_turn = request.getParameter("first_turn");
%>
<div id="main_container">  <!-- Inizio contenitore principale -->

    <div id="title">  <!-- Inizio titolo -->
        <h1 class="center">Sink And Win!</h1>
    </div>  <!-- Fine titolo -->

    <div id="player">  <!-- Inizio giocatore -->
        <h3 id="loggedUsername"><%=username%></h3>
        <h2 id="turn"></h2>
        <p id="opponentUsername" style="visibility: hidden;"><%=opponent%></p>
        <p id="firstTurn" style="visibility: hidden;"><%=first_turn%></p>
    </div>
    <script> waitForSocketConnection(ws, registerUser);</script>

    <div id="grids"> <!-- Inizio GRIGLIE create dinamicamente da JS-->
    </div>  <!-- Fine GRIGLIE -->


    <div id="console" class="console"> <!-- Inizio CONSOLE -->

        <table class="console">
            <tr>
                <th>#</th>
                <th>Ship type</th>
                <th>Dimension</th>
            </tr>
            <tr>
                <td>1</td>
                <td>Portaerei</td>
                <td>5</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Corazzate</td>
                <td>4</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Sottomarini</td>
                <td>3</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Incrociatori</td>
                <td>2</td>
            </tr>
        </table>

    </div> <!-- Fine terminali -->

</div> <!-- Fine contenitore principale -->

</body>

<!-- controlla la risoluzione dello schermo e setta il background adeguato -->
<script>setBackground()</script>

</html>