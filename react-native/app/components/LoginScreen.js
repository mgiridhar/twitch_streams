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

export default class LoginScreen extends Component {
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
      alert("Error connecting to ther server");
      console.log(error);
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
      alert("Error connecting to ther server");
      console.log(error);
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
            source={require('../../resources/gawkboxLogo.jpg')}
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
