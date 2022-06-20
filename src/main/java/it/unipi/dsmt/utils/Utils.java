package it.unipi.dsmt.utils;

import it.unipi.dsmt.persistence.KeyValueDB;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Utils {
    //to redirect to a specific page
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
    //returns the rank corresponding to the user points
    public static String ranking(String user)
    {
        KeyValueDB keyValueDB = KeyValueDB.getInstance();
        if(Integer.parseInt(keyValueDB.getPoints(user)) < 100)
        {
            return "Bronze rank";
        }
        else if(Integer.parseInt(keyValueDB.getPoints(user)) < 200 && Integer.parseInt(keyValueDB.getPoints(user)) > 100) {
            return "Silver rank";
        }
        else if(Integer.parseInt(keyValueDB.getPoints(user)) < 300 && Integer.parseInt(keyValueDB.getPoints(user)) < 200) {
            return "Gold rank";
        }
        else {
            return "Platinum rank";
        }
    }

    //returns the number of points left to the next rank
    public static int leftPoints(String rank, int points){
        if(rank == "Bronze rank")
            return 100 - points;
        else if(rank == "Silver rank")
            return 200 - points;
        else if(rank == "Gold rank")
            return 300 - points;
        else
            return 0;
    }
}
