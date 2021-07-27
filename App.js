import React, {useState} from 'react';
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
    justifyContent: 'center',
    elevation: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
});
const App = () => {
  return (
    <View style={styles.body}>
      <View style={styles.nav}>
        <Text style={styles.navText}>CrossBoards</Text>
      </View>
      <View style={styles.textInput}>
        <Text style={styles.textInputLabel}>PASTE</Text>
        <TextInput style={styles.textComp} placeholder="paste" />
        <View style={styles.inputButton}>
          <Button title="Share" color="red" />
        </View>
      </View>
      <View />
    </View>
  );
};
export default App;
