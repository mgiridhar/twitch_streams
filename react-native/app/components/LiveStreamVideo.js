import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  AnimatedView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
//import VideoPlayer from './VideoPlayer';
//import Video from 'react-native-video';

export default class LiveStreamVideo extends Component {
  static navigationOptions = {
    title:'Live Video',
    headerLeft: null,
  };

  constructor(props) {
    super(props);
    this.state = {isLoading: true};
    this.videoRef = this.props.videoRef;
  }

  componentDidMount() {
    console.log("video mounted")
    const { params } = this.props.navigation.state;
    const channelName = params ? params.channelName : null;
    return fetch('http://localhost:8080/live_stream_url?channel_name=' + channelName)
     .then((response) => response.json())
     .then((responseJson) => {

       this.setState({
         isLoading: false,
         videoUrl: responseJson.video_url,
       }, function() {

       });
     })
     .catch((error) => {
       alert("Error connecting to ther twitch server");
       console.log(error);
     });
  }

  componentWillUnMount() {
    console.log("video unmounted");
    this.videoRef = undefined;
    this.setState({isLoading: true});
  }

  render() {
    const resetAction = NavigationActions.reset({
      index: 0, key: null,
      actions: [NavigationActions.navigate({ routeName: 'LiveStreams' })],
    });
    console.log("video screen " + this.props.navigation.isFocused());
    if(this.state.isLoading) {
      return(
        <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large"/>
        </View>
      )
    }
    //console.log(this.state.videoUrl)
    //<View style={styles.vcontainer}>
   //   <Text style={styles.heading}>Live stream</Text>
   // </View>
   /*let html = `
    <script src= "http://player.twitch.tv/js/embed/v1.js"></script>
    <div id="player1"></div>
    `
    let jsCode = `
       var options = {
         channel: ` + this.props.channelName + `,
       };
       var player = new Twitch.Player("player1", options);
       player.setVolume(0.5);
       `*/
       //console.log(this.state.videoUrl);
    return (
      //uri: 'https://www.youtube.com/embed/A71aqufiNtQ'
      // source={{uri: 'https://player.twitch.tv/?channel=pgl_dota2'}}
      <View style={{flex:1,
        alignItems:'center', justifyContent: 'flex-start', paddingTop:20,
        backgroundColor: '#00CC99' //'#B3FFEC'
      }}>
        <View style={{justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              //console.log("video ref:" + JSON.stringify(this.videoRef));
              console.log(this.videoRef);
              this.props.navigation.goBack();
              this.videoRef = undefined;
              //console.log("video ref:" + this.videoRef);
              //this.props.navigation.navigate('DrawerOpen');
              //this.props.navigation.dispatch(resetAction);
            }}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <WebView
          ref={this.videoRef}
          source={{uri: this.state.videoUrl}}
          style={styles.video}
          //thirdPartyCookiesEnabled={true} // android
          //allowsInlineMediaPlayback={true} // ios
        />
      </View>

    //<VideoPlayer videoUrl={this.state.videoUrl} />
    /*<WebView style={styles.video}
      source={{html: html}}
      injectedJavaScript={jsCode}
      javaScriptEnabledAndroid={true}
    />*/
    /*<View style={styles.video}>
    <Video
      source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
      rate={1.0}
      volume={1.0}
      muted={false}
      resizeMode="cover"
      shouldPlay
      isLooping
      //style={{ width: 300, height: 300 }}
    />
  </View>*/
    )
  }
}

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#003333',
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
    marginLeft: 250,
  },
  backButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    padding: 5,
  },
  video: {
    width: ScreenWidth,
    height: ScreenHeight,
  },
})
