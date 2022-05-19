<%--
  Created by IntelliJ IDEA.
  User: luanabussu
  Date: 19/05/22
  Time: 21:30
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="eng">
<head>
    <title>Battleship</title>
    <link rel="stylesheet" type="text/css" href="./css/style.css">
    <meta charset="utf-8" />
    <script type="text/javascript" src="./js/code.js"></script> <!-- Viene richiamato il file con il codice Javascript -->
</head>

<body>

<div id="main_container">  <!-- Inizio contenitore principale -->

    <div id="title">  <!-- Inizio titolo -->
        <h1 class="center">Sink And Win!</h1>
    </div>  <!-- Fine titolo -->

    <div id="player">  <!-- Inizio giocatore -->
        <h3 id="playerTitle"></h3>
    </div>  <!-- Fine giocatore -->

    <div id="grids"> <!-- Inizio GRIGLIE create dinamicamente da JS-->
    </div>  <!-- Fine GRIGLIE -->

    <!-- Disegna nel div grids le tabelle a seconda del turno di gioco -->
    <script type="text/javascript">drawGrids()</script>

    <div id="console" class="console"> <!-- Inizio CONSOLE -->

        <!-- <script>consoleSettingMsg()</script> -->

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
                <td>Corrazzate</td>
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

    <div id="buttons" class="buttons"> <!-- Inizio bottoni - ID è stato modificato in class per anomalia css -->
        <a id="button" class="button" href="#" onclick="setupDone();return false;" class="blackshadow">GIOCA!</a>
    </div>  <!-- Fine bottoni -->

</div> <!-- Fine contenitore principale -->

</body>

<!-- controlla la risoluzione dello schermo e setta il background adeguato -->
<script>setBackground()</script>

</html>