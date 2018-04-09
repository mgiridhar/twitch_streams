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
   WebView,
   Dimensions,
   Alert,
   AppRegistry,
 } from 'react-native';
 import {StackNavigator, TabNavigator, SwitchNavigator} from 'react-navigation';
 //import Icon from 'react-native-vector-icons/FontAwesome';


 //import LiveStreams from './app/components/LiveStreams';
 class LiveStreamVideo extends Component {
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
          videoUrl: responseJson.video_url,
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
       />

     )
   }
 }

 class RenderStreams extends Component {
   constructor(props) {
     super(props);
   }

   _renderItem = ({item}) => {
     //console.log(item.preview)
     return(
       <TouchableOpacity
         onPress={
           () => this.props.navigation.navigate('LiveStreamVideo', {
             channelName: item.name,
           })
           //() => this.onPressItem(item.name)
         }
         style={{
           margin: 5,
           backgroundColor: '#B3FFEC', //'#EFFDED',
           alignItems: 'center',
           borderWidth: 1,
           borderColor: '#B3FFEC',//'#555555',
           borderRadius: 1 ,
         }}
         >
           <Text style={{flex: 1, margin: 5, fontSize:16, fontWeight: 'bold'}}>{item.game}</Text>
           <Image style={{flex: 4, paddingLeft: 5, width: '95%', height: 150, borderRadius: 7}} source={{uri: item.preview}} />
           <View style={{flex: 1, margin: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
             <Text style={{flex: 1, fontStyle: 'italic'}}>Channel: {item.display_name}</Text>
             <Text style={{flex: 1, fontStyle: 'italic'}}>Views: {item.views}</Text>
           </View>
         </TouchableOpacity>
     );
   }

   render() {
     if(this.props.isLoading) {
       return(
         <ActivityIndicator size="large" color="#fff"/>
       )
     }
     return(
       <FlatList
         style={styles.list}
         data={this.props.dataSource}
         renderItem={this._renderItem}
         keyExtractor={(item, index) => item.name}
       />
     )
   }
 }

 class LiveStreams extends Component {
   static navigationOptions = {
     title:'Live Streams',
   };
   constructor(props) {
     super(props);
     this.state = {
       isLoading: true,
       text: '',
       selected: null,
       liveStreamsREST: 'http://localhost:8080/live_streams',
       liveStreamsQueryREST: 'http://localhost:8080/live_streams_query?query=',
     }
   }

   componentDidMount() {
     this.getLiveStreams(this.state.liveStreamsREST);
   }

   getLiveStreams(restUrl) {
     //console.log(restUrl);
     this.setState({isLoading: true});
     return fetch(restUrl)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function() {

        });
      })
      .catch((error) => {
        console.error(error);
      });
   }

   onPressItem(name) {
     this.setState({
       selected: ((this.state.selected !== name) ? name : null)
     });
   }

   /*
   <TouchableOpacity
     onPress={
       () => this.getLiveStreams(this.state.liveStreamsREST)
     }
     >
     <Text style={styles.heading}>Get All Live streams</Text>
   </TouchableOpacity>
   */
   render() {
      //console.log("Live Streams...... CHECK")
      return(
          <View style={{flex:1,
            alignItems:'center', justifyContent: 'flex-start',
            backgroundColor: '#00CC99' //'#B3FFEC'
          }}>
            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => this._signOutAsync()}>
                <Text style={styles.logoutText}>LOGOUT</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.TextInputStyleClass}
              placeholder='Search live streams'
              onChangeText={(text) => this.setState({text})}
              onSubmitEditing = {() => {
                if(this.state.text !== '') {
                  this.getLiveStreams(this.state.liveStreamsQueryREST + this.state.text);
                }
                else {
                  this.getLiveStreams(this.state.liveStreamsREST);
                }
              }}
              onEndEditing = {() => {
                if(this.state.text !== '') {
                  this.getLiveStreams(this.state.liveStreamsQueryREST + this.state.text);
                }
                else {
                  this.getLiveStreams(this.state.liveStreamsREST);
                }
              }}
              maxLength = {100}
              autoCapitalize = {'none'}
              autoCorrect = {false}
            >
            </TextInput>
            <RenderStreams
              isLoading={this.state.isLoading}
              dataSource={this.state.dataSource}
              navigation={this.props.navigation}
            />
          </View>
      );
   }

   _signOutAsync = async () => {
     this.props.navigation.navigate('Auth');
   }
 }

 class LoginScreen extends Component {
   static navigationOptions = {
     title:'SIGN IN',
   };

   constructor(props) {
     super(props);
     this.state = {
       modalVisible: false,
       username: '', email: '', password: '', loginName: '',
       signUpREST: 'http://localhost:8080/sign_up',
       loginREST: 'http://localhost:8080/login',
     }
   }

   signUpCall(username, email, password) {
     //console.log(username, email, password);
     fetch(this.state.signUpREST, {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         username: username,
         email: email,
         password: password,
       }),
     })
     .then((response) => response.json())
     .then((responseJson) => {
       if(responseJson.successful === 'true') {
         Alert.alert("Success", responseJson.message, [
           { text: "OK", onPress: () => this.setModalVisible(!this.state.modalVisible)}
         ])
       }
       else {
         alert(responseJson.message);
       }
     })
     .catch((error) => {
       console.error(error);
     });
   }

   loginCall(loginName, password) {
     fetch(this.state.loginREST, {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         login_name: loginName,
         password: password,
       }),
     })
     .then((response) => response.json())
     .then((responseJson) => {
       if(responseJson.successful === 'true') {
         //console.log("success")
         this._signInAsync();
         //this.props.navigation.navigate('LiveStreams');
       }
       else {
         alert(responseJson.message);
       }
     })
     .catch((error) => {
       console.error(error);
     });
   }

   setModalVisible(visible) {
     this.setState({modalVisible: visible});
   }

   render() {
     return (
       <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>

         <Modal
           animationType="slide"
           transparent={false}
           visible={this.state.modalVisible}
           onRequestClose={() => {
             alert('Modal has been closed.');
           }}>
           <View style={styles.modalContainer}>
             <View style={styles.formContainer}>
               <TextInput
                 style={styles.input}
                 placeholder='username'
                 placeholderTextColor='rgba(255,255,255,0.7)'
                 onChangeText={(text) => this.setState({username: text})}
                 returnKeyType='next'
                 autoCapitalize="none"
                 autoCorrect={false}
                 onSubmitEditing={() => this.emailInput.focus()}
               />
               <TextInput
                 style={styles.input}
                 placeholder='email'
                 placeholderTextColor='rgba(255,255,255,0.7)'
                 onChangeText={(text) => this.setState({email: text})}
                 returnKeyType='next'
                 keyboardType="email-address"
                 autoCapitalize="none"
                 autoCorrect={false}
                 ref={(input) => this.emailInput = input}
                 onSubmitEditing={() => this.passwordInput.focus()}
               />
               <TextInput
                 style={styles.input}
                 placeholder='password'
                 placeholderTextColor='rgba(255,255,255,0.7)'
                 onChangeText={(text) => this.setState({password: text})}
                 secureTextEntry
                 returnKeyType='go'
                 ref={(input) => this.passwordInput = input}
               />
               <TouchableOpacity
                 style={styles.buttonContainer}
                 onPress={() => this.signUpCall(this.state.username, this.state.email, this.state.password)}>
                 <Text style={styles.buttonText}>SIGN UP!</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 style={styles.buttonContainer}
                 onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                 <Text style={styles.buttonText}>CANCEL</Text>
               </TouchableOpacity>
             </View>
           </View>
         </Modal>

         <View style={styles.logoContainer}>
           <Image
             style={styles.logo}
             source={require('./resources/gawkboxLogo.jpg')}
           />
           <Text style={styles.logoTitle}>An app made for twitch live streams using React Native</Text>
         </View>
         <View style={styles.formContainer}>
           <TextInput
             style={styles.input}
             placeholder='username or email'
             placeholderTextColor='rgba(255,255,255,0.7)'
             onChangeText={(text) => this.setState({loginName: text})}
             returnKeyType='next'
             keyboardType="email-address"
             autoCapitalize="none"
             autoCorrect={false}
             onSubmitEditing={() => this.passwordInput.focus()}
           />
           <TextInput
             style={styles.input}
             placeholder='password'
             placeholderTextColor='rgba(255,255,255,0.7)'
             onChangeText={(text) => this.setState({password: text})}
             secureTextEntry
             returnKeyType='go'
             ref={(input) => this.passwordInput = input}
           />
           <TouchableOpacity
             style={styles.buttonContainer}
             onPress={() => this.loginCall(this.state.loginName, this.state.password)}>
             <Text style={styles.buttonText}>LOGIN</Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={styles.buttonContainer}
             onPress={() => this.setModalVisible(!this.state.modalVisible)}
             >
             <Text style={styles.buttonText}>SIGN UP!</Text>
           </TouchableOpacity>
         </View>
       </KeyboardAvoidingView>
     );
   }

   _signInAsync = async() => {
     //console.log("inside signin async")
     this.props.navigation.navigate('App');
   }
 }

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

 let ScreenHeight = Dimensions.get("window").height;
 let ScreenWidth = Dimensions.get("window").width;
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
   video: {
     width: ScreenWidth,
     height: ScreenHeight,
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
