/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View, Alert} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
// import {Icon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
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
    flex: 10,
    textAlign: 'center',
    marginLeft: 50,
  },
  textInput: {
    height: 150,
  },
  navBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyPaste: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  copyPasteBtn: {
    flex: 1,
    padding: 2,
    margin: 5,
  },
  clearBtn: {
    padding: 5,
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
    flex: 1,
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
  useEffect(() => {
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(doc => {
          if (doc) {
            setText(doc.data().clip);
          }
        });
    }
  }, [user]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      auth().signInWithCredential(googleCredential);
      Alert.alert('Alert', 'Signed in!', [
        {
          text: 'Signed in!',
          onPress: () => console.log('close'),
          style: 'default',
        },
      ]);
      return;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
      } else {
        console.log(error);
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
      });
    Alert.alert('Alert', 'Signed out!', [
      {
        text: 'Signed out!',
        onPress: () => console.log('close'),
        style: 'default',
      },
    ]);
  };
  const updateBoard = useCallback(async () => {
    if (text.length < 1) {
      await Clipboard.getString().then(clip => {
        if (user) {
          firestore().collection('users').doc(user.uid).set({
            clip: clip,
          });
        }
      });
    } else {
      if (user) {
        firestore().collection('users').doc(user.uid).set({
          clip: text,
        });
      }
    }
  }, [text, user]);

  useEffect(() => {
    async function pasteText() {
      await Clipboard.getString()
        .then(clip => {
          if (clip === text) {
            updateBoard();
          }
        })
        .catch(err => console.log(err));
    }
    pasteText();
  }, [text, updateBoard]);
  const handleText = txt => {
    setText(txt);
  };
  const copyToClipboard = () => {
    if (text.length < 1) {
      Alert.alert('Error', 'Text Field empty!', [
        {
          text: 'OK',
          onPress: () => console.log('close'),
          style: 'default',
        },
      ]);
    }
    Clipboard.setString(text);
  };
  const clearBoard = () => {
    setText('');
  };
  return (
    <View style={styles.body}>
      <View style={styles.nav}>
        <View style={styles.navBox}>
          <Text style={styles.navText}>CrossBoards</Text>
          <Icon
            style={styles.toggleLogin}
            name={user ? 'logout' : 'login'}
            size={30}
            color="black"
            onPress={user ? signOut : signIn}
          />
        </View>
      </View>
      <View style={styles.textInput}>
        <Text style={styles.textInputLabel}>Copy/Paste here :</Text>
        <TextInput
          style={styles.textComp}
          placeholder="paste"
          onChangeText={handleText}
          value={text}
        />
        <View style={styles.inputButton}>
          <View style={styles.copyPaste}>
            <View style={styles.copyPasteBtn}>
              <Button onPress={copyToClipboard} title="Copy" />
            </View>
            <View style={styles.copyPasteBtn}>
              <Button onPress={updateBoard} title="Paste" />
            </View>
          </View>
          <View style={styles.clearBtn}>
            <Button onPress={clearBoard} color="red" title="Clear" />
          </View>
        </View>
      </View>
      <View />
    </View>
  );
};
export default App;
