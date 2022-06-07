package it.unipi.dsmt.filter;

import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import it.unipi.dsmt.utils.Utils;

@WebFilter(filterName = "AccessFilter", servletNames = {"HomeServlet"})
public class AccessFilter implements Filter {
    public void init(FilterConfig config) throws ServletException {
    }

    public void destroy() {
    }

    @Override

    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        HttpSession session = request.getSession();
        PrintWriter out = response.getWriter();

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        if ((username != null) && (password != null) &&
                (username.length() >= 2) && (password.length() >= 2) &&
                ((request.getParameter("loginButton") != null) || (request.getParameter("registerButton") != null)))
        {
            // Only the first time i need to do the login process
            chain.doFilter(req, resp);
        }
        else if (session.getAttribute("loggedUser") != null)
        {
            Utils.goTo("chooseGame.jsp", request, response);
        }
        else
        {
            out.println("<script type=\"text/javascript\">");
            out.println("alert('Invalid access!');");
            out.println("document.location.href='./index.jsp';"); // forced logout
            out.println("</script>");
            out.close();
        }

        out.close();
    }
}
