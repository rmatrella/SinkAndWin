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
        System.out.println("username: " + username + "\npassword: " + password);
        response.setContentType("text/html");
        KeyValueDB db = KeyValueDB.getInstance();

        HttpSession session = request.getSession();


        if(request.getParameter("loginButton") != null)
        {
            System.out.println("doPost Login");
            User user = db.isLogin(username, password);
            System.out.println("username trovato:" + user.getUsername());

            if(user == null)
            {
                PrintWriter out = response.getWriter();
                out.println("<script type=\"text/javascript\">");
                out.println("alert('Something wrong. Check if your username and password are correct!');");
                out.println("document.location.href='./index.jsp';");
                out.println("</script>");
                out.close();
            }
            else
            {
                 session.setAttribute("logUser", user);
                 //Utils.goTo("index.jsp", request, response);

                Utils.goTo("pages/game.jsp", request, response);
            }
        }else{ //registration part
            if(db.usernameAlreadyUsed(username))
            {
                PrintWriter out = response.getWriter();
                out.println("<script type=\"text/javascript\">");
                out.println("alert('Username already used, change it and try again!');");
                out.println("document.location.href='./index.jsp';");
                out.println("</script>");
                out.close();
            }
            else
            {
                db.registerUser(username, password);
                session.setAttribute("logUser", username);
                Utils.goTo("index.jsp", request, response);
            }
        }

    }
}
