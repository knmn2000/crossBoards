/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import {Icon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#e5e5e5',
    flex: 1,
    justifyContent: 'space-between',
  },
  nav: {
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  textInput: {
    height: 150,
  },
  textComp: {
    color: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    margin: 15,
    borderWidth: 2,
    borderRadius: 5,
  },
  textInputLabel: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  inputButton: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 50,
  },
  toggleLogin: {
    marginRight: 12,
  },
});
const App = () => {
  GoogleSignin.configure({
    webClientId:
      '697751841375-mu1jh3fchr1668mode2epvf8vcileja2.apps.googleusercontent.com',
  });
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [text, setText] = useState();

  // Handle user state changes

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const userId = userInfo.user.id;
      database()
        .ref(`/users/${userId}`)
        .on('value', snapshot => {
          console.log('data ', snapshot.val());
        });
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      auth().signInWithCredential(googleCredential);
      return;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(error);
      } else {
        console.log(error);
        // some other error happened
      }
    }
  };
  const signOut = () => {
    auth()
      .signOut()
      .then(async () => {
        setUser({user: null});
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        console.log('signedout');
      });
  };
  const updateBoard = () => {
    firestore().collection('users').doc(user.uid).set({
      clip: text,
    });
    console.log(user.uid);
  };
  return (
    <View style={styles.body}>
      <View style={styles.nav}>
        <Text style={styles.navText}>CrossBoards</Text>
        <Icon style={styles.toggleLogin} name="login" size={30} color="black" />
      </View>
      <View style={styles.textInput}>
        <Text style={styles.textInputLabel}>PASTE</Text>
        <TextInput
          style={styles.textComp}
          placeholder="paste"
          onChangeText={t => setText(t)}
        />
        <View style={styles.inputButton}>
          {/* <Button title="sign in" color="red" onPress={() => onGoogle} /> */}
          <GoogleSigninButton onPress={signIn} />
          <Button onPress={signOut} title="signout" />
          <Button onPress={updateBoard} title="COPY" />
        </View>
      </View>
      <View />
    </View>
  );
};
export default App;
