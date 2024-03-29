import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';

import { store } from './States/Store';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { pullFromBackend } from './Requests/https';

import SplashScreen from './Screens/SplashScreen';

import OnBoarding from "./Screens/Onboarding/OnBoarding";
import SignUp from "./Screens/Onboarding/SignUp";
import Login from "./Screens/Onboarding/Login";
import ForgotPassword from "./Screens/Onboarding/ForgotPassword";
import ResetPassword from "./Screens/Onboarding/ResetPassword";

import SetupWallet from './Screens/Setup/SetupWallet';
import AddWallet from './Screens/Setup/AddWallet';
import SetupSuccess from './Screens/Setup/SetupSuccess';

import Home from './Screens/Core/HomeScreen';
import AddTransaction from './Screens/Core/AddTransactionScreen';
import AddIncome from './Screens/Core/AddIncomeScreen';
import Notification from './Screens/Core/NotificationScreen';
import TransactionScreen from './Screens/Core/TransactionScreen';

import ProfileScreen from './Screens/Profile/ProfileScreen';
import EditProfileScreen from './Screens/Profile/EditProfileScreen';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function App() {
  const [token, setToken] = useState("")
  const [walletCreated, setWalletCreated] = useState(false)
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      let response = null

      try{
        response = await pullFromBackend()
      } catch (error) {
        response = null
      }
      
      if(response !== null) {  
        const userIdFromDatabase = Object.keys(response)[0] // Eventually, we need to traverse Object.keys(response) and get the data of the key saved on the user device

        setToken(response[userIdFromDatabase].userInformation.token)
        setWalletCreated(response[userIdFromDatabase].userInformation.walletCreated)
      }
    }

    fetchData()

    setTimeout(() => {
      setAppLoading(false)
    }, 3000)
  }, [])

  function OnBoardingNavigation() {
    return (
      <Stack.Navigator screenOptions={{contentStyle: {backgroundColor: 'white'}}}>
        <Stack.Screen name="OnBoarding" component={OnBoarding} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{title: "Sign Up"}}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}  options={{title: "Forgot Password"}}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{title: "Reset Password"}}/>
        <Stack.Screen name="SetupNavigation" component={SetupNavigation} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
  }

  function SetupNavigation() {
    return (
        <Stack.Navigator>
          <Stack.Screen name="Setup Account" component={SetupWallet} options={{headerShown:false}}/>
          <Stack.Screen name="AddAccount" component={AddWallet} options={{
              title: "Add Wallet",
              headerStyle: {backgroundColor:'#7F3DFF'},
              headerTintColor: 'white',
              headerShadowVisible: false,
              contentStyle: {backgroundColor: '#7F3DFF'},
            }}
          />
          <Stack.Screen name="SetupSuccess" component={SetupSuccess} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
  }

  function CoreNavigation() {
    return (
      <BottomTab.Navigator initialRouteName="Home">
        <BottomTab.Screen 
          name="Transaction" component={TransactionScreen} options={{
            headerShown:false,
            tabBarIcon: ({focused}) => <FontAwesome5 name="people-arrows" size={24} color={focused? "#7F3DFF": "grey"}/>,
            tabBarActiveTintColor: "#7F3DFF",
            tabBarInactiveTintColor: "grey",
          }}
        />

        <BottomTab.Screen 
          name="Home" component={Home} options={{
            headerShown:false,
            tabBarIcon: ({focused}) => <Ionicons name="home" size = {25} color={focused? "#7F3DFF": "grey"}/>,
            tabBarActiveTintColor: "#7F3DFF",
            tabBarInactiveTintColor: "grey",
          }}
        />

        <BottomTab.Screen 
          name="Profile" component={ProfileScreen} options={{
            headerShown:false,
            tabBarIcon: ({focused}) => <MaterialCommunityIcons name="account" size={30} color={focused? "#7F3DFF": "grey"}/>,
            tabBarActiveTintColor: "#7F3DFF",
            tabBarInactiveTintColor: "grey",
          }}
        />
      </BottomTab.Navigator>
    )
  }

  return (
    <>
      <StatusBar style="auto" />

      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='SpashScreen' screenOptions={{contentStyle: {backgroundColor: 'white'}}}>
            {appLoading?<Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}}/>: null}
            {token === ""?<Stack.Screen name="OnBoardingNavigations" component={OnBoardingNavigation} options={{headerShown:false}}/>: null}
            {!walletCreated?<Stack.Screen name="SetupNavigation" component={SetupNavigation} options={{headerShown:false}}/>: null}
            <Stack.Screen name="CoreNavigation" component={CoreNavigation} options={{headerShown:false}}/>

            <Stack.Screen name="AddTransaction" component={AddTransaction} 
              options ={{
                contentStyle: {backgroundColor: '#FD3C4A'}, 
                headerStyle: {backgroundColor: '#FD3C4A'},
                headerTintColor: 'white',
                title: "Add Transaction",
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen name="AddIncome" component={AddIncome} options ={{
                contentStyle: {backgroundColor: '#00A86B'}, 
                headerStyle: {backgroundColor: '#00A86B'},
                headerTintColor: 'white',
                title: "Monthly Income",
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen name="Notification" component={Notification}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{title: "Edit Profile"}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
