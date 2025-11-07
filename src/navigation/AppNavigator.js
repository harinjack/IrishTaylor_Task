import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import { useAuth } from '../context/AuthContext';

const Root = createStackNavigator();
const AuthStackNav = createStackNavigator();
const AppStackNav = createStackNavigator();

function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
    </AuthStackNav.Navigator>
  );
}

function AppStack() {
  return (
    <AppStackNav.Navigator>
      <AppStackNav.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Details' }} />
    </AppStackNav.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'App' : 'Auth'}>
        <Root.Screen name="Auth" component={AuthStack} />
        <Root.Screen name="App" component={AppStack} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
