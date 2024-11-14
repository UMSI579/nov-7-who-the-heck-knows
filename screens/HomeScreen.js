import {signOut, getAuthUser} from '../AuthManager';
import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import {subscribeToUserUpdates} from "../features/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  useEffect(() => {
    subscribeToUserUpdates(dispatch)
  }, []);


  const users = useSelector(state => state.authSlice.users);
  const currentAuthUser = getAuthUser();

  return (
    <View style={styles.container}>
      <Text>
        You're signed in { getAuthUser().displayName }!
      </Text>

      <Text>
        Here are your friends!
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={users}
          renderItem={({item}) => {
            if (item.key === currentAuthUser.uid) {
              return (<View/>)
            } else {
              return (
                <Text>{item.displayName}</Text>
              )
            }
          }}
        />
      </View>
      <Button
        onPress={async () => {
          try {
            await signOut();
            // navigation.navigate('Login');
          } catch (error) {
            Alert.alert("Sign Out Error", error.message,[{ text: "OK" }])
          }
        }}
      >
        Now sign out!
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink'
  },

  listContainer: {
    flex: 0.5,
    width: '100%',
  }
});
export default HomeScreen;