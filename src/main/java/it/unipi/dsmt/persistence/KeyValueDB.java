package it.unipi.dsmt.persistence;

import java.io.File;
import java.io.IOException;

import it.unipi.dsmt.dto.User;
import org.iq80.leveldb.*;
import static org.iq80.leveldb.impl.Iq80DBFactory.*;

public class KeyValueDB {

    private static volatile KeyValueDB instance;
    private String path;
    public DB db;

    private KeyValueDB(){
        this("/database");
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

    public User isLogin(String username, String password) {
        User user = null;
        String pwd;

        String userExists = get(username);
        System.out.println("USER: " + userExists);
        pwd = getValue("user:" + username + ":password");

        if (pwd != null && pwd.equals(password)) {
            user = new User(username, password);
        }
        System.out.println("UTENTE: " + user.getUsername());
        return user;
    }


    public boolean usernameAlreadyUsed(String username) {

        String password = getValue("user:"+username+":password");

        if(password != null)
            return true;

        return false;
    }

    public void registerUser(String username, String password){

        putValue("user:" + username + ":password", password);
    }
}

