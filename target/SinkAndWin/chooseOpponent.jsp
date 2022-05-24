<%@ page import="it.unipi.dsmt.dto.User" %><%--
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
<h2 class="center-text"> Welcome
    <span id="loggedUsername"><%
        out.print(((User)session.getAttribute("logUser")).getUsername());%></span>!
</h2>
<h3 class="center"> Choose an opponent! </h3>
<div id="snippetContent">
   <div class="containerTable">
               <table class="table user-list">
                   <thead>
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
                       <tbody style="background: #9daccb;">
                       <% for(int i = 0; i < 10; i++)
                       {
                       %>
                       <tr>
                           <td>
                               Mila Kunis
                           </td>
                           <td>
                               <span class="label label-default"><img src="./images/online-icon.png" class="icon">Online</span>
                            </td>
                           <td>
                               100
                           </td>
                           <td>
                               <button type="button" value="sendRequest" class="sendRequest"> Send Request</button>
                           </td>

                       </tr>
                   <% } %>
                   </tbody>
               </table>
   </div>
    <div class="search-container">
        <form action="FindOpponentServlet">
            <input type="text" placeholder="Search.." name="search">
            <button type="submit"><img src="./images/search.png" id="search"></button>
        </form>
    </div>
</div>
</body>
</html>


