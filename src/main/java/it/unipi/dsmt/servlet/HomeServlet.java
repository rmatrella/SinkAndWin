package it.unipi.dsmt.servlet;

import it.unipi.dsmt.dto.User;
import it.unipi.dsmt.persistence.KeyValueDB;
import it.unipi.dsmt.utils.Utils;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "HomeServlet", value = "/HomeServlet")
public class HomeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        response.setContentType("text/html");
        KeyValueDB db = KeyValueDB.getInstance();

        HttpSession session = request.getSession();

        if(request.getParameter("loginButton") != null) //login button clicked
        {
            User user = db.isLogin(username, password);

            if(user == null) // not found a corresponding user/password into the db, notifies to user
            {
                PrintWriter out = response.getWriter();
                out.println("<script type=\"text/javascript\">");
                out.println("alert('Username or password wrong, please try again!');");
                out.println("document.location.href='./index.jsp';");
                out.println("</script>");
                out.close();
            }
            else //user found, redirect to the main page
            {
                session.setAttribute("logUser", user);
                Utils.goTo("chooseOpponent.jsp", request, response);
            }
        }else{ //registration button clicked
            if(db.usernameAlreadyUsed(username)) //username already existing, notifies to user
            {
                //response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                PrintWriter out = response.getWriter();
                out.println("<script type=\"text/javascript\">");
                out.println("alert('Username already used, change it and try again!');");
                out.println("document.location.href='./index.jsp';");
                out.println("</script>");
                out.close();
            }
            else //registation done, notifies to user
            {
                //response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                PrintWriter out = response.getWriter();
                out.println("<script type=\"text/javascript\">");
                out.println("alert('Registration done, login to join the game!');");
                out.println("document.location.href='./index.jsp';");
                out.println("</script>");
                out.close();
                db.registerUser(username, password);
                session.setAttribute("logUser", new User(username, password, 0));
                Utils.goTo("index.jsp", request, response);
            }
        }

    }
}
