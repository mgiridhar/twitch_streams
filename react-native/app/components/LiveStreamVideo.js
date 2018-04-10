import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import VideoPlayer from './VideoPlayer';

export default class LiveStreamVideo extends Component {
  static navigationOptions = {
    title:'Live Video',
  };

  constructor(props) {
    super(props);
    this.state = {isLoading: true}
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const channelName = params ? params.channelName : null;
    return fetch('http://localhost:8080/live_stream_url?channel_name=' + channelName)
     .then((response) => response.json())
     .then((responseJson) => {

       this.setState({
         isLoading: false,
         videoUrl: 'https://player.twitch.tv/?channel=monstercat', //responseJson.video_url,
       }, function() {

       });
     })
     .catch((error) => {
       console.error(error);
     });
  }

  render() {
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
    return (
      //uri: 'https://www.youtube.com/embed/A71aqufiNtQ'
      // source={{uri: 'https://player.twitch.tv/?channel=pgl_dota2'}}
      <WebView
        source={{uri: this.state.videoUrl}}
        style={styles.video}
        thirdPartyCookiesEnabled={true} // android
        allowsInlineMediaPlayback={true} // ios
      />
      /*<VideoPlayer videoUrl={this.state.videoUrl} />*/
    )
  }
}

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  video: {
    width: ScreenWidth,
    height: ScreenHeight,
  },
})
