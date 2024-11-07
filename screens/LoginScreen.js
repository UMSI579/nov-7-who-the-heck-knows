import {signIn} from "../AuthManager";
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';


function SigninBox({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeaderText}>Sign In</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder='enter email address'
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setEmail(text)}
            value={email}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder='enter password'
            autoCapitalize='none'
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={text=>setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <Button
          onPress={async () => {
            try {
              await signIn(email, password);
              navigation.navigate('Home');
            } catch(error) {
              Alert.alert("Sign In Error", error.message,[{ text: "OK" }])
            }
          }}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
}


function LoginScreen({navigation}) {

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <SigninBox navigation={navigation}/>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: '30%',
    paddingBottom: '10%',
  },
  loginHeader: {
    width: '100%',
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginHeaderText: {
    fontSize: 24,
    color: 'black',
    paddingBottom: '5%'
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: '3%'
  },
  loginLabelContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  loginLabelText: {
    fontSize: 18
  },
  loginInputContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
  },
  loginInputBox: {
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 18,
    padding: '2%'
  },
  modeSwitchContainer:{
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'pink'
  },
  loginButtonRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    flex: 0.7,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
export default LoginScreen;