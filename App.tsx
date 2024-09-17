import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { MainIcon } from './components/atoms/Icon'; // Ajusta las rutas según tu estructura
import * as Tokens from './components/tokens'; // Ajusta las rutas según tu estructura
import Login from './components/screens/Login';
import Home from './components/screens/Home';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="Login" // Pantalla de inicio de sesión
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home" // Pantalla principal
          component={Home} // Asegúrate de importar y definir correctamente el componente Home
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
