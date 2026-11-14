import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import StoresScreen from '../screens/StoresScreen';
import StoreDetailScreen from '../screens/StoreDetailScreen';
import CinemaScreen from '../screens/CinemaScreen';
import FoodCourtScreen from '../screens/FoodCourtScreen';
import ServicesScreen from '../screens/ServicesScreen';
import CartScreen from '../screens/CartScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stores') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Cinema') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'Dining') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'map' : 'map-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Mall Home' }} />
      <Tab.Screen name="Stores" component={StoresScreen} options={{ tabBarLabel: 'Directory' }} />
      <Tab.Screen name="Cinema" component={CinemaScreen} options={{ tabBarLabel: 'Cinema' }} />
      <Tab.Screen name="Dining" component={FoodCourtScreen} options={{ tabBarLabel: 'Food Court' }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ tabBarLabel: 'Services' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

