package main

import (
	"encoding/json"
	//"fmt"
	"gawkbox-assignment/mysql"
	"gawkbox-assignment/twitch"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

type Configuration struct {
	HTTP_PORT int
	LOGS_PATH string
}

var (
	CONFIG_FILE string = os.Getenv("GOPATH") + "/src/gawkbox-assignment/config/config.json"
	config      Configuration
	Tracelog    *log.Logger
	Infolog     *log.Logger
	Warninglog  *log.Logger
	Errorlog    *log.Logger
)

func init() {

	confFile, err := os.Open(CONFIG_FILE)
	if err != nil {
		log.Fatalln(err.Error())
		panic(err.Error())
	}
	defer confFile.Close()

	decoder := json.NewDecoder(confFile)
	err = decoder.Decode(&config)
	if err != nil {
		log.Fatalln(err.Error())
		panic(err.Error())
	}

	if _, err := os.Stat(config.LOGS_PATH); os.IsNotExist(err) {
		os.Mkdir(config.LOGS_PATH, 744)
	}
	log.Println("Initializing log configuration")
	file, err := os.OpenFile(config.LOGS_PATH+"/logs.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("Failed to open log file", ":", err)
	}

	multi := io.MultiWriter(file, os.Stdout)

	Tracelog = log.New(multi,
		"TRACE: ",
		log.Ldate|log.Ltime|log.Llongfile)

	Infolog = log.New(multi,
		"INFO: ",
		log.Ldate|log.Ltime|log.Llongfile)

	Warninglog = log.New(multi,
		"WARNING: ",
		log.Ldate|log.Ltime|log.Llongfile)

	Errorlog = log.New(multi,
		"ERROR: ",
		log.Ldate|log.Ltime|log.Llongfile)

	mysql.Tracelog = Tracelog
	mysql.Infolog = Infolog
	mysql.Warninglog = Warninglog
	mysql.Errorlog = Errorlog
	twitch.Tracelog = Tracelog
	twitch.Infolog = Infolog
	twitch.Warninglog = Warninglog
	twitch.Errorlog = Errorlog
}

func main() {
	Infolog.Println("Booting the server...")

	// Configure a sample route
	//http.HandleFunc("/sample_route", myHandlerFunc)

	//defer mysql.Db.Close()

	// Configure get live stream url of a channel
	http.HandleFunc("/live_stream_url", getLiveStreamUrl)

	// Configure to get all live streams
	http.HandleFunc("/live_streams", getAllLiveStreams)

	// Configure to get all live streams based on query
	http.HandleFunc("/live_streams_query", getLiveStreamsByQuery)

	// Configure signing up user
	http.HandleFunc("/sign_up", checkSignUp)

	// Configure validating login
	http.HandleFunc("/login", validateLogin)

	// Run server
	http.ListenAndServe(":"+strconv.Itoa(config.HTTP_PORT), nil)
	//http.ListenAndServe(":8080", nil)
}

// myHandlerFunc - A sample handler function for the route /sample_route for your HTTP server
//func myHandlerFunc(w http.ResponseWriter, r *http.Request) {
//	fmt.Println("Recieved the following request:", r.Body)

//	twitch.DoSomething()

// YOUR ROUTES LOGIC GOES HERE
//
// Feel free to structure your routing however you see fit, this is just an example to get you started.

//}

// getAllLiveStreams - A handler function to get all current live streaming users
func getAllLiveStreams(respWriter http.ResponseWriter, req *http.Request) {
	Infolog.Println("Getting all live streamers...")

	// get all live stream users as an array of map
	// limit to get all live streamers is 100 - which is set by twitch api
	resp := twitch.GetAllLiveStreams(100)
	respJson, err := json.Marshal(resp)
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}

	respWriter.Header().Set("Content-Type", "application/json")
	respWriter.Write(respJson)
}

// getLiveStreamsByQuery - A handler function to get all live streaming users whose game name or channel description matches the query
func getLiveStreamsByQuery(respWriter http.ResponseWriter, req *http.Request) {
	Infolog.Println("Getting live streamers by query...")

	queries, ok := req.URL.Query()["query"]
	if !ok || len(queries) < 1 {
		Errorlog.Println("Url Param 'query' is missing")
		return
	}
	query := queries[0]

	// get live stream users by query as an array of map
	// limit to get all live streamers is 100 - which is set by twitch api
	resp := twitch.GetLiveStreamsByQuery(query)
	respJson, err := json.Marshal(resp)
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}

	respWriter.Header().Set("Content-Type", "application/json")
	respWriter.Write(respJson)
}

// getLiveStreamUrl - A handler function to the live streaming video url
func getLiveStreamUrl(respWriter http.ResponseWriter, req *http.Request) {
	Infolog.Println("Get live stream url")
	//fmt.Println(req.URL.Query())
	names, ok := req.URL.Query()["channel_name"]
	if !ok || len(names) < 1 {
		Errorlog.Println("Url Param 'channel_name' is missing")
		return
	}

	name := names[0]
	vurl := twitch.GetLiveStreamUrl(name)
	//fmt.Println(vurl)
	respMap := make(map[string]string)
	respMap["video_url"] = vurl
	//fmt.Println(respMap)

	// response
	respJson, err := json.Marshal(respMap)
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}
	respWriter.Header().Set("Content-Type", "application/json")
	respWriter.Write(respJson)
}

// version 1 - not working
// getLiveStreamUrl - A handler function to the live streaming video url
/*
func getLiveStreamUrl(respWriter http.ResponseWriter, req *http.Request) {
	fmt.Println("Get live stream url")
	//fmt.Println(req.URL.Query())
	ids, ok := req.URL.Query()["channel_id"]
	if !ok || len(ids) < 1 {
		fmt.Println("Url Param 'channel_id' is missing")
		return
	}

	id := ids[0]
	vurl := twitch.GetLiveStreamUrl(id)
	//fmt.Println(vurl)

	respMap := make(map[string]string)
	respMap["video_url"] = vurl
	//fmt.Println(respMap)

	// response
	respJson, err := json.Marshal(respMap)
	if err != nil {
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}
	respWriter.Header().Set("Content-Type", "application/json")
	respWriter.Write(respJson)

	//fmt.Println(req.Host)
	//fmt.Println(req.URL)

	//uri, err := url.Parse(req.URL.Path)
	//if err != nil {
	//	panic(err)
	//}
	//fmt.Println(uri)

	//params, _ := url.ParseQuery(uri.RawQuery)
	//fmt.Println(params)
}*/

func validateLogin(respWriter http.ResponseWriter, req *http.Request) {

	Infolog.Println("Validating login")
	respWriter.Header().Set("Content-Type", "application/json")
	respMap := make(map[string]string)

	// Read body
	reqBytes, err := ioutil.ReadAll(req.Body)
	defer req.Body.Close()
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}

	//fmt.Println(string(reqBytes))
	// Unmarshal
	var params map[string]string
	err = json.Unmarshal(reqBytes, &params)
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}
	//fmt.Println(params)

	loginName := params["login_name"]
	password := params["password"]

	if loginName == "" {
		Errorlog.Println("Url Param 'login_name' is missing/empty")
		respMap["successful"] = "false"
		// insert message
		respMap["message"] = "Username/Email shouldn't be empty"
	} else if password == "" {
		Errorlog.Println("Url Param 'password' is missing/empty")
		respMap["successful"] = "false"
		// insert message
		respMap["message"] = "Password shouldn't be empty"
	} else if mysql.ValidateLogin(loginName, password) == false {
		respMap["successful"] = "false"
		// insert message
		respMap["message"] = "Wrong username or password"
	} else {
		// insert successful message
		respMap["successful"] = "true"
		respMap["message"] = "SignUp successful!"
	}

	respJson, err := json.Marshal(respMap)
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}
	respWriter.Write(respJson)
}

func checkSignUp(respWriter http.ResponseWriter, req *http.Request) {

	Infolog.Println("Signing up and check")
	respWriter.Header().Set("Content-Type", "application/json")
	respMap := make(map[string]string)

	// Read body
	reqBytes, err := ioutil.ReadAll(req.Body)
	defer req.Body.Close()
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}

	//fmt.Println(string(reqBytes))
	// Unmarshal
	var params map[string]string
	err = json.Unmarshal(reqBytes, &params)
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}
	//fmt.Println(params)

	username := params["username"]
	email := params["email"]
	password := params["password"]

	if username == "" {
		Errorlog.Println("Url Param 'username' is missing/empty")
		respMap["successful"] = "false"
		// insert message
		respMap["message"] = "Username shouldn't be empty"
	} else if email == "" {
		Errorlog.Println("Url Param 'email' is missing/empty")
		respMap["successful"] = "false"
		// insert message
		respMap["message"] = "Email shouldn't be empty"
	} else if password == "" {
		Errorlog.Println("Url Param 'password' is missing/empty")
		respMap["successful"] = "false"
		// insert message
		respMap["message"] = "Password shouldn't be empty"
	} else if mysql.SignUp(username, email, password) == false {
		respMap["successful"] = "false"
		// insert message
		respMap["message"] = "username/email already available"
	} else {
		// insert successful message
		respMap["successful"] = "true"
		respMap["message"] = "SignUp successful!"
	}

	respJson, err := json.Marshal(respMap)
	if err != nil {
		Errorlog.Println(err.Error())
		http.Error(respWriter, err.Error(), http.StatusInternalServerError)
		return
	}
	respWriter.Write(respJson)
}
