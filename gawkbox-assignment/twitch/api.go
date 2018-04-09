package twitch

import (
	"encoding/json"
	//"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	//"strings"
)
import . "net/http"

var (
	Tracelog   *log.Logger
	Infolog    *log.Logger
	Warninglog *log.Logger
	Errorlog   *log.Logger
)

func init() {
	log.Println("Initializing Twitch API...")
}

//func DoSomething() {
//	fmt.Println("Something.")
//}

var (
	API_URL           string = "https://api.twitch.tv/kraken"
	API_VERSION_PARAM string = "&api_version=5"
	SEARCH            string = "/search"
	STREAMS           string = "/streams"
	CHANNELS          string = "/channels"
	VIDEOS            string = "/videos"
	CLIENT_ID_PARAM   string = "&client_id=4qrsyz6temgwxi4v1kvzfu81wl19p0"
	PLAYER_URL        string = "http://player.twitch.tv/?"
	CHANNEL_PARAM     string = "channel="
	QUERY_PARAM       string = "&query="
)

func GetLiveStreamUrl(channelName string) string {
	Infolog.Println("Retrieving Live stream URL...")

	playerUrl := PLAYER_URL + CHANNEL_PARAM + channelName
	return playerUrl
}

/*
func GetLiveStreamUrl(channelId string) string {
	fmt.Println("Retrieving Live stream URL...")

	// twitch api call to get the videos of the particular channel
	// videos are ordered based on time, so the most recent one is at the top which is retrieved using parameter "limit=1"
	chVideosUrl := API_URL + CHANNELS + "/" + channelId + VIDEOS + "?" + "limit=1" + CLIENT_ID_PARAM + API_VERSION_PARAM
	response, err := http.Get(chVideosUrl)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	// convert ioreader to bytes
	respBytes, ioerr := ioutil.ReadAll(response.Body)
	if ioerr != nil {
		panic(ioerr)
	}

	// convert bytes array to a map of key,values
	respMap := make(map[string]interface{})
	err = json.Unmarshal([]byte(respBytes), &respMap)
	if err != nil {
		panic(err)
	}

	// retrieve the videos array from the response map
	videos := respMap["videos"].([]interface{})
	// retrieve the first & only video from the array
	video := videos[0].(map[string]interface{})
	// get the url from the map
	return video["url"].(string)
}*/

func GetAllLiveStreams(limit int) []map[string]string {
	Infolog.Println("Retrieving all live streaming users...")
	if limit < 1 {
		Errorlog.Println("Limit should be a positive integer")
		return nil
	}
	if limit > 100 {
		Warninglog.Println("Maximum live streaming results limit is 100 ")
		limit = 100
	}
	streamsUrl := API_URL + STREAMS + "?" + "limit=" + strconv.Itoa(limit) + CLIENT_ID_PARAM + API_VERSION_PARAM
	//fmt.Println(streamsUrl)
	response, err := http.Get(streamsUrl)
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error())
	}
	defer response.Body.Close()

	return extractStreams(response)
}

func GetLiveStreamsByQuery(query string) []map[string]string {
	Infolog.Println("Retrieving all live streaming users for query " + query + "...")

	streamsUrl := API_URL + SEARCH + STREAMS + "?" + CLIENT_ID_PARAM + API_VERSION_PARAM + QUERY_PARAM + query
	//fmt.Println(streamsUrl)
	response, err := http.Get(streamsUrl)
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error())
	}
	defer response.Body.Close()

	return extractStreams(response)
}

func extractStreams(response *Response) []map[string]string {

	// convert ioreader to bytes
	respBytes, ioerr := ioutil.ReadAll(response.Body)
	if ioerr != nil {
		Errorlog.Println(ioerr.Error())
		panic(ioerr.Error())
	}

	// convert bytes array to a map of key,values
	respMap := make(map[string]interface{})
	err := json.Unmarshal([]byte(respBytes), &respMap)
	if err != nil {
		Errorlog.Println(err.Error())
		panic(err.Error())
	}

	// retrieve streams array from the response map
	streams := respMap["streams"].([]interface{})

	// map to return the result
	var result []map[string]string

	// iterate through streams and get all user, channel_id information
	for index := range streams {
		stream := streams[index].(map[string]interface{})
		channel := stream["channel"].(map[string]interface{})
		//fmt.Println(strconv.FormatFloat(channel["_id"].(float64), 'f', 0, 64), channel["name"].(string), channel["display_name"].(string))
		temp := make(map[string]string)
		//temp["channel_id"] = strconv.FormatFloat(channel["_id"].(float64), 'f', 0, 64)
		temp["game"] = getString(channel["game"])
		temp["name"] = getString(channel["name"])
		temp["display_name"] = getString(channel["display_name"])
		//temp["video_banner"] = getString(channel["video_banner"])
		temp["views"] = getFloatString(channel["views"])
		temp["preview"] = getPreviewUrl(stream["preview"])
		result = append(result, temp)
	}
	//fmt.Println(result)
	return result
}

func getPreviewUrl(value interface{}) string {
	if value == nil {
		return ""
	}
	preview := value.(map[string]interface{})
	return getString(preview["medium"])
	//imageUrl = strings.Replace(imageUrl, "{width}", "320", 1)
	//imageUrl = strings.Replace(imageUrl, "{height}", "180", 1)
}

func getString(value interface{}) string {
	if value != nil {
		return value.(string)
	}
	return ""
}

func getFloatString(value interface{}) string {
	if value != nil {
		return strconv.FormatFloat(value.(float64), 'f', 0, 64)
	}
	return ""
}
