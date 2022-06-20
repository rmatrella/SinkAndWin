package it.unipi.dsmt.persistence;

import java.io.File;
import java.io.IOException;
import java.util.*;

import it.unipi.dsmt.dto.User;
import org.iq80.leveldb.*;

import static org.iq80.leveldb.impl.Iq80DBFactory.*;

public class KeyValueDB {

    private static volatile KeyValueDB instance;
    private String path;
    public DB db;

    private KeyValueDB(){
        this("/db/database");

    }

    private KeyValueDB(String path) {
        this.path = path;
        openDB();
    }

    public static KeyValueDB getInstance() {

        if (instance == null) {
            synchronized (KeyValueDB.class) {
                if (instance == null)
                    instance = new KeyValueDB();
            }
        }
        return instance;
    }

    private void openDB() {

        Options options = new Options();
        options.createIfMissing(true);

        try {
            db = factory.open(new File(path), options);

        } catch (IOException e) {
            e.printStackTrace();
            closeDB();
        }
    }

    private void closeDB() {
        try {
            if (db != null) db.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String get(String key) {
        byte[] bytes = db.get(bytes(key));
        return (bytes == null ? null : asString(bytes));
    }

    private String getValue(String key) {
        return asString(db.get(bytes(key)));
    }

    private void putValue(String key, String value) {
        db.put(bytes(key), bytes(value));
    }

    //login of the user
    public User isLogin(String username, String password) {
        User user = null;
        String pwd;
        String points;

        pwd = getValue("user:" + username + ":password");
        points = getValue("user:" + username + ":points");

        if (pwd != null && pwd.equals(password)) { //if username and password valid
            user = new User(username, password, Integer.parseInt(points));
        }
        return user;
    }

    //check if the username selected is already used
    public boolean usernameAlreadyUsed(String username) {

        String password = getValue("user:"+ username +":password");

        if(password != null)
            return true;

        return false;
    }
    //registers the user in the db
    public void registerUser(String username, String password){

        putValue("user:" + username + ":password", password);
        putValue("user:" + username + ":points", "0");
    }

    //updates the user points
    public void updatePoints(String username, int points){
        String key = "user:" + username + ":points";
        putValue(key, Integer.toString(points));
    }
    //gets user points
    public String getPoints(String username){
        String key = "user:" + username + ":points";
        return getValue(key);
    }
}

