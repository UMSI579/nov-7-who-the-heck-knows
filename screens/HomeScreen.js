import {signOut, getAuthUser} from '../AuthManager';
import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import {subscribeToUserUpdates, addOrSelectChat} from "../features/authSlice";
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
        You're signed in { currentAuthUser?.displayName }!
      </Text>

      <Text>
        Here are your friends!
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={users}
          renderItem={({item}) => {
            if (item.key === currentAuthUser?.uid) {
              return (<View/>)
            } else {
              return (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(addOrSelectChat({
                      user1id: currentAuthUser.uid,
                      user2id: item.key,
                    }));
                    navigation.navigate('Chat', {
                      currentUserId: currentAuthUser.uid,
                      otherUserId: item.key
                    })
                  }}
                >
                  <Text>{item.displayName}</Text>
                </TouchableOpacity>
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