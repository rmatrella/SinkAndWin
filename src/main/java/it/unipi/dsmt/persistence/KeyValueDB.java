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
        //this("..\\..\\..\\..\\..\\..\\..\\database");
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
        String points;

        String userExists = get(username);
        System.out.println("USER: " + userExists);
        pwd = getValue("user:" + username + ":password");
        points = getValue("user:" + username + ":points");
        System.out.println();

        if (pwd != null && pwd.equals(password)) {
            user = new User(username, password, Integer.parseInt(points));
        }
        return user;
    }


    public boolean usernameAlreadyUsed(String username) {

        String password = getValue("user:"+ username +":password");

        if(password != null)
            return true;

        return false;
    }

    public void registerUser(String username, String password){

        putValue("user:" + username + ":password", password);
        putValue("user:" + username + ":points", "0");
    }

    public String ifUsername(String username) {

        try (DBIterator iterator = db.iterator();) {
            for (iterator.seekToFirst(); iterator.hasNext(); iterator.next()) {

                String key = asString(iterator.peekNext().getKey());
                System.out.println("US: " + key);
                if (key.startsWith("user") && key.contains("password")) {
                    String[] us = key.split(":");
                    if (us[1].equals(username))
                        return "true";
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "false";
    }

    public void updatePoints(String username, int points){
        String key = "user:" + username + ":points";
        putValue(key, Integer.toString(points));
    }
    public String getPoints(String username){
        String key = "user:" + username + ":points";
        return getValue(key);
    }

    public static HashMap<String, Integer> sortByValue(HashMap<String, Integer> hm)
    {
        // Create a list from elements of HashMap
        List<Map.Entry<String, Integer> > list =
                new LinkedList<Map.Entry<String, Integer> >(hm.entrySet());

        // Sort the list
        Collections.sort(list, new Comparator<Map.Entry<String, Integer> >() {
            public int compare(Map.Entry<String, Integer> o1,
                               Map.Entry<String, Integer> o2)
            {
                return (o2.getValue()).compareTo(o1.getValue());
            }
        });

        // put data from sorted list to hashmap
        HashMap<String, Integer> temp = new LinkedHashMap<String, Integer>();
        for (Map.Entry<String, Integer> aa : list) {
            temp.put(aa.getKey(), aa.getValue());
        }
        return temp;
    }

    public Map<String, Integer> getRank() {

        HashMap<String, Integer> users = new HashMap<>();

        try (DBIterator iterator = db.iterator()) {
            for (iterator.seekToFirst(); iterator.hasNext(); iterator.next()) {
                String key = asString(iterator.peekNext().getKey());
                String value = asString(iterator.peekNext().getValue());

                if(key.endsWith("points")) {
                    String[] us = key.split(":");
                    users.put(us[1], Integer.parseInt(value));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return sortByValue(users);
    }
}

