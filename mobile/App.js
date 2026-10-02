import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/AuthContext';
import { Loading } from './src/components';
import { C } from './src/config';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import ItemDetails from './src/screens/ItemDetails';
import ReportItem from './src/screens/ReportItem';
import MyReports from './src/screens/MyReports';
import SubmitClaim from './src/screens/SubmitClaim';
import MyClaims from './src/screens/MyClaims';
import ManageClaims from './src/screens/ManageClaims';
import Profile from './src/screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const header = { headerStyle: { backgroundColor: C.ink }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' } };

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ ...header, tabBarActiveTintColor: C.ink, tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }, tabBarIconStyle: { display: 'none' }, tabBarItemStyle: { justifyContent: 'center' } }}>
      <Tab.Screen name="Home" component={Home} options={{ title: 'Browse' }} />
      <Tab.Screen name="MyReports" component={MyReports} options={{ title: 'My reports' }} />
      <Tab.Screen name="MyClaims" component={MyClaims} options={{ title: 'My claims' }} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function Root() {
  const { user, booting } = useAuth();
  if (booting) return <Loading />;
  return (
    <Stack.Navigator screenOptions={header}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="ItemDetails" component={ItemDetails} options={{ title: 'Item details' }} />
          <Stack.Screen name="ReportItem" component={ReportItem} options={{ title: 'Report an item' }} />
          <Stack.Screen name="SubmitClaim" component={SubmitClaim} options={{ title: 'Claim this item' }} />
          <Stack.Screen name="ManageClaims" component={ManageClaims} options={{ title: 'Claims on your item' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ title: 'Log in' }} />
          <Stack.Screen name="Register" component={Register} options={{ title: 'Create account' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Root />
      </NavigationContainer>
    </AuthProvider>
  );
}
