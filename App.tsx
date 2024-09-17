import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { MainIcon } from './components/atoms/Icon'; 
import * as Tokens from './components/tokens'; 
import Login from './components/screens/Login';
import Home from './components/screens/Home';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="Login" 
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home" 
          component={Home} 
          options={{
            title: 'Home Screen',
            headerStyle: { backgroundColor: 'black' },
            headerTintColor: 'white',
          }}
        />
      </Stack>
    </View>
  );
}
