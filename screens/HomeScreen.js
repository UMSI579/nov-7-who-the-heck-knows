
import { Button } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text>
        You're signed in!
      </Text>
      <Button
        onPress={() => {
          navigation.navigate('Login');
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
  }
});
export default HomeScreen;