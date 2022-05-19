<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SinkAndWin</title>
    <link href="css/index.css" rel="stylesheet" type="text/css"/>
    <link rel="icon" type="image/jpg" href="images/icon.jpg"/>
</head>
<body>

<h1 class="center-text">Welcome to SinkAndWin!</h1>

<%
    if(request.getParameter("loginError") != null)
    {
        out.println("<script type=\"text/javascript\">");
        out.println("alert('Errore');");
        out.println("</script>");
    }
%>

<div class="divFifty">
    <form action="HomeServlet" class="formStyle" method="post">
        <div class="imgcontainer">
            <img src="images/icon.jpg" alt="icon" class="icon">
        </div>

        <div class="container">
            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" id="username" name="username" required>

            <label for="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" id="password" name="password" required>

            <button type="submit" name="loginButton">Login</button>
            <button type="submit" name="registerButton"> Register</button>
        </div>
    </form>
</div>
</body>
</html>