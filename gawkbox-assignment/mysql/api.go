package mysql

import (
	"database/sql"
	//"fmt"
	"encoding/json"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"os"
	"strconv"
)

//import . "database/sql"

/*
mysql> create table users(id int NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL, email varchar(50) NOT NULL, password varchar(256) NOT NULL, primary key (id), unique key username(username), unique key email(email)) charset=utf8;

mysql> describe users;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int(11)      | NO   | PRI | NULL    | auto_increment |
| username | varchar(50)  | NO   | UNI | NULL    |                |
| email    | varchar(50)  | NO   | UNI | NULL    |                |
| password | varchar(256) | NO   |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
*/

var (
	CONFIG_FILE       string = os.Getenv("GOPATH") + "/src/gawkbox-assignment/config/config.json"
	Tracelog          *log.Logger
	Infolog           *log.Logger
	Warninglog        *log.Logger
	Errorlog          *log.Logger
	CONNECTION_STRING string
	// Db *DB
)

type Configuration struct {
	MYSQL_PORT     int
	MYSQL_USER     string
	MYSQL_PASSWORD string
	MYSQL_DBNAME   string
	MYSQL_IP       string
}

func init() {

	confFile, err := os.Open(CONFIG_FILE)
	if err != nil {
		log.Fatalln(err.Error())
		panic(err.Error())
	}
	defer confFile.Close()

	decoder := json.NewDecoder(confFile)
	var config Configuration
	err = decoder.Decode(&config)
	if err != nil {
		log.Fatalln(err.Error())
		panic(err.Error())
	}

	CONNECTION_STRING = config.MYSQL_USER + ":" + config.MYSQL_PASSWORD + "@tcp(" + config.HOST_IP + ":" + strconv.Itoa(config.MYSQL_PORT) + ")/" + config.MYSQL_DBNAME
	//log.Println(CONNECTION_STRING)

	/*
		db, err := sql.Open("mysql", CONNECTION_STRING)
		if err != nil {
			log.Println(err.Error())
			panic(err.Error()) // proper error handling instead of panic in your app
		}
		defer db.Close()
		log.Println("Successfully opened mysql connection..")*/
}

// signUp - to create new user account with username and password
// returns false - if username/email already available
// returns true - if succesfully inserted user information into table
func SignUp(username, email, password string) bool {

	db, err := sql.Open("mysql", CONNECTION_STRING)
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	defer db.Close()
	Infolog.Println("Successfully opened mysql connection..")

	// Prepare statement for inserting data
	stmtIns, err := db.Prepare("insert into users(username, email, password) values( ? , ? , ? )") // ? = placeholder
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	_, err = stmtIns.Exec(username, email, password) // Insert tuples
	if err != nil {
		Warninglog.Println("username/email already exists")
		Warninglog.Println(err.Error())
		//panic(err.Error()) // proper error handling instead of panic in your app
		return false
	}

	Infolog.Println("Successfully inserted values into users table")
	return true
}

// validateLogin - to validate the given username and password so that the user can log in
// returns false - if username not avaiable or password incorrect
// returns true - if valid credentials
func ValidateLogin(loginName, password string) bool {

	db, err := sql.Open("mysql", CONNECTION_STRING)
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	defer db.Close()
	Infolog.Println("Successfully opened mysql connection..")

	// Prepare statement for reading data
	stmtOut, err := db.Prepare("select count(username) as count from users where ( username = ? or email = ? ) and password = ?")
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	defer stmtOut.Close()

	var count int // we "scan" the result in here

	// Query the square-number of 13
	err = stmtOut.QueryRow(loginName, loginName, password).Scan(&count) // WHERE number = 13
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	if count == 0 {
		Warninglog.Println("username not available or password incorrect")
		return false
	}
	return true
}
