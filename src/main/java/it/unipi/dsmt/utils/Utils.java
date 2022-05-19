package it.unipi.dsmt.utils;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Utils {

    public static void goTo(String location, HttpServletRequest request, HttpServletResponse response)
    {
        RequestDispatcher reqDispatcher  = request.getRequestDispatcher(location);
        try {
            reqDispatcher.include(request, response);
        } catch (ServletException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
