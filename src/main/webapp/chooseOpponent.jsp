<%@ page import="it.unipi.dsmt.dto.User" %>
<%@ page import="it.unipi.dsmt.persistence.KeyValueDB" %>
<%@ page import="java.util.Map" %>
<%@ page import="it.unipi.dsmt.utils.Utils" %><%--
  Created by IntelliJ IDEA.
  User: matre
  Date: 19/05/2022
  Time: 19:42
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Play game</title>
    <link href="css/chooseOpponent.css?version=51" rel="stylesheet" type="text/css"/>
</head>
<body>
<script src="js/websocket.js?version=51"></script>
<script src="js/requests.js?version=51"></script>
<script> waitForSocketConnection(ws, registerUser);</script>

<h2 class="center-text"> Welcome
    <span id="loggedUsername"><%
        User user = (User)session.getAttribute("logUser");
        out.print(user.getUsername());
        KeyValueDB keyValueDB = KeyValueDB.getInstance();
        Map<String, Integer> bestplayers = keyValueDB.getRank();
        %></span>!
</h2>
<a href="LogoutServlet" class="logout"><button id="logout">Logout</button></a>
<div id="snippetContent">
   <div class="containerTable" style="float:left;">
       <h3 class="center"> Choose an opponent! </h3>
       <table class="table">
           <thead style="background-color: #9daccb;">
           <tr>
               <th>
                   <span>User</span>
               </th>
               <th class="text-center">
                   <span>Status</span>
               </th>
               <th class="text-center">
                   <span>Send Request</span>
               </th>
           </tr>
           </thead>
           <tbody id="onlineUsers">
           </tbody>
       </table>
       <div id="scrollButtons">
           <button id="prev" type="button" class="buttonTable" onclick="previousUsers();" disabled> Previous </button>
           <button id="next" type="button" class="buttonTable" onclick="nextUsers();" disabled> Next </button>
           <div class="clear"></div>
       </div>
   </div>
    <div class="containerTable" style="float: right;">
        <h3 class="center"> Your points </h3>
        <table class="table">
            <thead style="background-color: #9daccb;">
            <tr>
                <th>
                    <span>Your rank</span>
                </th>
            </tr>
            </thead>
            <tbody id="userRank">
                <tr>
                    <td><span style="color: royalblue; font-size: 23px;">
                        You have
                        <%
                            /*int i = 1;
                            for (Map.Entry<String, Integer> players : bestplayers.entrySet()) {
                                out.print("<tr><td class='center'>" + i + "</td><td class='center'>" + players.getKey() + "</td><td class='center'>" + players.getValue() + "</td></tr>");
                                i++;
                                if(i >= 6)
                                    break;
                            }*/
                            int points = user.getPoints();
                            out.println(points);
                        %> points
                    </span></td>
                </tr>
                <tr>
                    <td><span>
                        You are in
                        <%
                            String rank = Utils.ranking(user.getUsername());
                            out.println(rank);
                        %>
                    </span></td>
                </tr>
                <tr>
                    <td><span>
                        <%
                            out.println(Utils.leftPoints(rank, points));
                        %>
                        points left to the next rank!
                    </span></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="containerTable" style="float: left;">
        <h3 class="center"> Game requests received </h3>
        <table class="table">
            <thead style="background-color: #9daccb;">
            <tr>
                <th>
                    <span>User</span>
                </th>
                <th>
                    <span>Accept Request</span>
                </th>
            </tr>
            </thead>
            <tbody id="userRequests">
            </tbody>
        </table>
    </div>
    <div class="containerTable" style="float: right;">
        <h3 class="center"> Game requests done</h3>
        <table class="table">
            <thead style="background-color: #9daccb;">
            <tr>
                <th>
                    <span>User</span>
                </th>
                <th>
                    <span>Cancel Request</span>
                </th>
            </tr>
            </thead>
            <tbody id="userRequestsDone">
            </tbody>
        </table>
    </div>
    <%--<div id="search-container">
        <h3 class="center" style="margin-right: 12%;"> Search a player </h3>
            <input type="text" id="userSearch" placeholder="Search.." name="userSearch">
            <button onclick="findUser();"><img src="./images/search.png" id="search"></button>
    </div>--%>
</div>
</div>
<span id="hidden">
</span>
</body>
</html>


