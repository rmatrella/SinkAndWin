package it.unipi.dsmt.dto;

public class User {

    private String username;
    private String password;
    private int points;

    public User(String username, String password, int points){
        this.username = username;
        this.password = password;
        this.points = points;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
