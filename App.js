import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeMapScreen from './screens/HomeMapScreen';
import ShuttleDetailScreen from './screens/ShuttleDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={HomeMapScreen} />
        <Stack.Screen name="ShuttleDetail" component={ShuttleDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}