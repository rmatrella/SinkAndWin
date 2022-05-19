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

        HttpSession session = request.getSession();


        if(request.getParameter("loginButton") != null)
        {
            System.out.println("doPost Login");
            User user = KeyValueDB.getInstance().isLogin(username, password);
            System.out.println("username trovato:" + user);

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
                 Utils.goTo("game.jsp", request, response);
            }
        }else{ //registration part

        }

    }
}
