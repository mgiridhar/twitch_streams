/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, {Component} from 'react';
 import {
   Platform,
   StyleSheet,
   Text,
   View, ScrollView, KeyboardAvoidingView,
   TextInput,
   Button,
   Image,
   FlatList,
   TouchableOpacity,
   Modal,
   ActivityIndicator,
   Dimensions,
   Alert,
   AppRegistry,
 } from 'react-native';
 import {StackNavigator, TabNavigator, SwitchNavigator} from 'react-navigation';
 //import Video from 'react-native-video';
 //import Icon from 'react-native-vector-icons/FontAwesome';

 import LiveStreamVideo from './app/components/LiveStreamVideo';
 import LiveStreams from './app/components/LiveStreams';
 import LoginScreen from './app/components/LoginScreen';


 const AppStack = StackNavigator(
   {
     LiveStreams: {
       screen: LiveStreams,
     },
     LiveStreamVideo: {
       screen: LiveStreamVideo,
     },
   },
   {
     initialRouteName: 'LiveStreams',
     navigationOptions: {
       headerStyle: {
         backgroundColor: '#00CC99',
       },
       headerTintColor: '#fff',
       headerTitleStyle: {
         fontWeight: 'bold',
       },
     },
   }
 );

 const AuthStack = StackNavigator(
   {
     Login: {
       screen: LoginScreen,
     },
   },
   {
     initialRouteName: 'Login',
     navigationOptions: {
       headerStyle: {
         backgroundColor: '#00CC99',
       },
       headerTintColor: '#fff',
       headerTitleStyle: {
         fontWeight: 'bold',
       },
     },
   }
 );

 const RouteSwitch = SwitchNavigator(
   {
     App: AppStack,
     Auth: AuthStack,
   },
   {
     initialRouteName: 'Auth',
   }
 );

 export default class App extends Component {

   render() {
     return(
       <RouteSwitch />
     );
   }
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     flexDirection: 'row',
     backgroundColor: '#F5FCFF',
     justifyContent: 'center',
     alignItems: 'center',
   },
   loginContainer: {
     flex: 1,
     backgroundColor: '#00CC99'
   },
   modalContainer: {
     flex: 1,
     backgroundColor: '#00CC99',
     paddingTop: 30
   },
   logoContainer: {
     alignItems: 'center',
     flexGrow: 1,
     justifyContent: 'center'
   },
   logo: {
     width: 200,
     height: 100
   },
   logoTitle: {
     color: '#FFF',
     marginTop: 10,
     width: 300,
     opacity: 0.9,
     textAlign: 'center'
   },
   formContainer: {
     padding: 20,
   },
   input: {
     height: 40,
     backgroundColor: 'rgba(255,255,255,0.2)',
     marginBottom: 10,
     color: '#FFF',
     paddingHorizontal: 10,
     fontSize: 16
   },
   buttonContainer: {
     backgroundColor: '#003333', //'#00664d',
     paddingVertical: 10,
     marginBottom: 10,
   },
   buttonText: {
     textAlign: 'center',
     color: '#FFFFFF',
     fontWeight: '700',
     fontSize: 18
   },
   logoutButton: {
     backgroundColor: '#003333',
     paddingVertical: 10,
     marginBottom: 5,
     marginLeft: 250,
   },
   logoutText: {
     textAlign: 'center',
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 14,
     padding: 5,
   },
   heading: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   list: {
     padding: 10,
     marginBottom: 3,
     width: "100%"
   },
   rowItem: {
     textAlign: 'left',
     color: '#333333',
     marginBottom: 1,
   },
   TextInputStyleClass: {
     textAlign: 'left',
     paddingLeft: 10,
     width: "92%",
     height: 40,
     margin: 10,
     fontSize: 18,
     borderWidth: 2,
     borderColor: '#B3FFEC',
     borderRadius: 1 ,
     backgroundColor : "#FFFFFF"
   }
 });

//AppRegistry.registerComponent('LiveStreams', () => LiveStreams);

/*
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}
*/

/** trying various video embeds*/
/*var htmlContent = `
 <script src= "http://player.twitch.tv/js/embed/v1.js"></script>
 <div id="live_video"></div>
 <script type="text/javascript">
   var options = {
     width: 300,
     height: 200,
     video: "247142093",
   };
   var player = new Twitch.Player("live_video", options);
   player.setVolume(0.5);
 </script>
`;
<script src= "http://player.twitch.tv/js/embed/v1.js"></script>
<div id="player"></div>
<script type="text/javascript">
 var options = {
     width: '100%',
     height: '100%',
     video: 'v247116841',
     playsinline: 'true'
 };
 var player = new Twitch.Player("player", options);
 player.setVolume(0.5);
</script>

(or)

<WebView
  source={{uri: 'http://player.twitch.tv/?video=247112022&autoplay=false'}}
  style={{height: 200, width: 300}}
/>
<WebView
  source={{uri: 'https://www.youtube.com/embed/A71aqufiNtQ'}}
  style={{height: 200, width: 300}}
/>
*/
