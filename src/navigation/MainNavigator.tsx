import React from 'react';
import { Text } from 'react-native';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { MainTabParamList } from '../types';
import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Dashboard: '🏠',
  History: '📊',
  Profile: '👤',
};

export default function MainNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<MainTabParamList>; navigation: unknown }): BottomTabNavigationOptions => ({
        tabBarIcon: () => (
          <Text style={{ fontSize: 22 }}>{TAB_ICONS[route.name as keyof MainTabParamList]}</Text>
        ),
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: '#4A90E2' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Rotina', headerTitle: 'Minha Rotina' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Histórico', headerTitle: 'Histórico' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil', headerTitle: 'Meu Perfil' }}
      />
    </Tab.Navigator>
  );
}
