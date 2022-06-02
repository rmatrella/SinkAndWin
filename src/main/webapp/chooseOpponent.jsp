<%@ page import="it.unipi.dsmt.dto.User" %>
<%@ page import="java.util.List" %>
<%@ page import="it.unipi.dsmt.persistence.KeyValueDB" %>
<%@ page import="java.security.Key" %>
<%@ page import="java.util.Map" %><%--
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
    <link href="css/chooseOpponent.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<script src="js/websocket.js"></script>
<script src="js/requests.js"></script>
<%
    /*String user = (String) session.getAttribute("user");
    System.out.println("user: " + user);
    String exists = (String) session.getAttribute("exists");
    System.out.println("exists: " + exists);*/
%>
<script> waitForSocketConnection(ws, registerUser);</script>

<h2 class="center-text"> Welcome
    <span id="loggedUsername"><%
        out.print(((User)session.getAttribute("logUser")).getUsername());%></span>!
</h2>
<a href="LogoutServlet" id="logout"><button>Logout</button></a>
<div id="snippetContent">
   <div class="containerTable" class="opponent">
       <h3 class="center"> Choose an opponent! </h3>
               <table class="table" class="opponent" style="min-width: 1020px; min-height: 250px;">
                   <thead style="background-color: #9daccb;">
                       <tr>
                           <th>
                               <span>User</span>
                           </th>
                           <th class="text-center">
                               <span>Status</span>
                           </th>
                           <th class="text-center">
                               <span>Points</span>
                           </th>
                           <th class="text-center">
                               <span>Send Request</span>
                           </th>
                       </tr>
                       </thead>
                   <tbody id="onlineUsers" style="background: #9daccb;">
                   </tbody>
               </table>
   </div>
    <div class="containerTable">
        <h3 class="center"> Game requests</h3>
        <table class="table" id="request_table" style="min-width: 1020px; min-height: 250px;">
            <thead style="background-color: #9daccb;">
            <tr>
                <th>
                    <span>User</span>
                </th>
                <th>
                    <span>Points</span>
                </th>
                <th>
                    <span>Accept Request</span>
                </th>
            </tr>
            </thead>
            <tbody id="userRequests" style="background: #9daccb;">
            </tbody>
        </table>
    </div>
    <div id="search-container">
        <h3 class="center" style="margin-right: 12%;"> Search a player </h3>
            <input type="text" id="userSearch" placeholder="Search.." name="userSearch">
            <button onclick="findUser();"><img src="./images/search.png" id="search"></button>
    </div>
</div>
</div>
<span id="hidden">
<%
    //if(user != null)
      //  out.println("<script> findUser(\"" + user + "\", \"" + exists + "\"); </script>");
%>
</span>
</body>
</html>


