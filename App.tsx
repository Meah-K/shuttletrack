import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EmptyStateScreen from './screens/EmptyStateScreen';
import ErrorScreen from './screens/ErrorScreen';
import DriverLoginScreen from './screens/DriverLoginScreen';
import DriverStatusScreen from './screens/DriverStatusScreen';
import DriverProfileScreen from './screens/DriverProfileScreen';
import DriverErrorScreen from './screens/DriverErrorScreen';
import TabNavigator from './navigation/TabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
          id="RootStack"
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
      >
        {/* Launch screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        {/* Student auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Student main app */}
        <Stack.Screen name="Main" component={TabNavigator} />

        {/* Utility screens */}
        <Stack.Screen name="EmptyState" component={EmptyStateScreen} />
        <Stack.Screen name="Error" component={ErrorScreen} />

        {/* Driver app */}
        <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
        <Stack.Screen name="DriverStatus" component={DriverStatusScreen} />
        <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
        <Stack.Screen name="DriverError" component={DriverErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}