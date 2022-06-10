package it.unipi.dsmt.servlet;

import it.unipi.dsmt.persistence.KeyValueDB;
import it.unipi.dsmt.utils.Utils;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "FindUserServlet", value = "/FindUserServlet")
public class FindUserServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("text/html");
        String username = request.getParameter("userSearch");
        KeyValueDB db = KeyValueDB.getInstance();
        String exists = db.ifUsername(username);
        HttpSession session = request.getSession();
        session.setAttribute("exists", exists);
        session.setAttribute("user", username);
        //PrintWriter out = response.getWriter();
        //String page = "request.js";
        //out.println("<script src=\"" + page +"\"></script>");
        //out.println("<script> findUser(\"" + username + "\"); </script>");
        Utils.goTo("chooseOpponent.jsp", request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        String username = request.getParameter("userSearch");
        KeyValueDB db = KeyValueDB.getInstance();
        String exists = db.ifUsername(username);
        HttpSession session = request.getSession();
        session.setAttribute("exists", exists);
        session.setAttribute("user", username);
        //PrintWriter out = response.getWriter();
        //String page = "request.js";
        //out.println("<script src=\"" + page +"\"></script>");
        //out.println("<script> findUser(\"" + username + "\"); </script>");
        Utils.goTo("chooseOpponent.jsp", request, response);
    }
}
