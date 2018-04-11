/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LiveStreamVideo from './LiveStreamVideo';

class RenderStreams extends Component {
  constructor(props) {
    super(props);
  }

  _renderItem = ({item}) => {
    //console.log(item.preview)
    return(
      <TouchableOpacity
        onPress={
          //this.props.isLoading= false,
          () => this.props.navigation.navigate('LiveStreamVideo', {
            channelName: item.name,
            videoRef: React.createRef(),
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

export default class LiveStreams extends Component {
  static navigationOptions = {
    title: 'Live Streams',
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
    console.log("Live streams mounted");
    this.getLiveStreams(this.state.liveStreamsREST);
  }

  componentWillUnmount() {
    console.log("Live streams unmounted");
    this.setState({isLoading: true});
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
       alert("Error connecting to ther server");
       console.log(error);
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
           alignItems:'center', justifyContent: 'flex-start', paddingTop:20,
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
                 this.getLiveStreams(this.state.liveStreamsQueryREST + '{' + this.state.text + '}');
               }
               else {
                 this.getLiveStreams(this.state.liveStreamsREST);
               }
             }}
             onEndEditing = {() => {
               if(this.state.text !== '') {
                 this.getLiveStreams(this.state.liveStreamsQueryREST + '{' + this.state.text + '}');
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 15,
    padding: 5,
  },
  list: {
    padding: 10,
    marginBottom: 3,
    width: "100%"
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
