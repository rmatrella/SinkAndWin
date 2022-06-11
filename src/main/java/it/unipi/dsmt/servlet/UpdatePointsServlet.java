package it.unipi.dsmt.servlet;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import it.unipi.dsmt.dto.User;
import it.unipi.dsmt.persistence.KeyValueDB;

@WebServlet(name = "UpdatePointsServlet", value = "/UpdatePointsServlet")
public class UpdatePointsServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("text/html");
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("logUser");
        String winner = request.getParameter("winner");
        KeyValueDB db = KeyValueDB.getInstance();
        int points = user.getPoints();

        if(user.getUsername().equals(winner)) {
            points++;
        }else{
            if(points > 0)
                points--;
        }
        db.updatePoints(user.getUsername(), points);
        user.setPoints(points);
        session.setAttribute("logUser", user);

        //response.sendRedirect("main.jsp");
        goToPage("chooseOpponent.jsp", request, response);
    }

    private void goToPage (String page, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        RequestDispatcher requestDispatcher = request.getRequestDispatcher(page);
        if (requestDispatcher != null)
            requestDispatcher.include(request, response);
    }
}
