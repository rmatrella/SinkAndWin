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
<script src="js/request.js"></script>
<h2 class="center-text"> Welcome
    <span id="loggedUsername"><%
        out.print(((User)session.getAttribute("logUser")).getUsername());%></span>!
</h2>
<div id="snippetContent">
   <div class="containerTable">
       <h3 class="center"> Choose an opponent! </h3>
               <table class="table">
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
                       <% for(int i = 0; i < 5; i++)
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
                               <button type="button" value="sendRequest" class="buttonRequest"> Send Request</button>
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
    <div class="containerTable">
        <h3 class="center"> Game requests</h3>
        <table class="table" id="request_table">
            <thead>
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
            <tbody style="background: #9daccb;">
            <% for(int j = 0; j < 2; j++)
            {
            %>
            <tr>
                <td class="center">
                    Mila Kunis
                </td>
                <td class="center">
                    50
                </td>
                <td class="center">
                    <button type="button" value="acceptRequest" class="buttonRequest"> Accept Request</button>
                </td>
            </tr>
            <% } %>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>


