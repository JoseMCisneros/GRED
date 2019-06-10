import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyCzkAWjVFRAxbdNyd5qqrACKzPwHKs5svc",
  authDomain: "gred-4fbff.firebaseapp.com",
  databaseURL: "https://gred-4fbff.firebaseio.com",
  storageBucket: "gred-4fbff.appspot.com",
};

firebase.initializeApp(config);

GoogleSignin.configure({
  webClientId: '1033735019806-nko6uhc2bf3fpi18ah478blqipk9o71e.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
});

export default class App extends React.Component {

  constructor(props){
    super(props)

    this.state = ({
      email: '',
      password: ''
    })
  }

  signUpUser = (email, password) => {
    try {
      if(this.state.password.length<6)
      {
        alert('La contraseña no puede tener menos de 6 caracteres.')
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
      console.log(error.toString())
    }
  }
  
  loginUser = (email, password) => {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      console.log(error.toString());
    }
  } 

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({email})}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
            secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(password) => this.setState({password})}
            />
          </Item>
          <Button style={{marginTop: 10}}
            full
            rounded
            success
            onPress={() => this.loginUser(this.state.email,this.state.password)}
          >
          <Text style={{color: 'white'}}> Login</Text>
          </Button>
          <Button style={{marginTop: 10}}
            full
            rounded
            primary
            onPress={() => this.signUpUser(this.state.email,this.state.password)}
          >
          <Text style={{color: 'white'}}> Sign Up</Text>
          </Button>
        </Form>
        <GoogleSigninButton
          style={{ width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
          disabled={this.state.isSigninInProgress} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
  },
});