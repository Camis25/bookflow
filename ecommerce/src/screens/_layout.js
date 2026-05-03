import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { initDatabase, createAdmin } from "../services/database";
import * as NavigationBar from 'expo-navigation-bar';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    initDatabase();
    createAdmin();
  }, []);
  
    useEffect(() => {
    const hideNavBar = async () => {
      // No Android, isso oculta a barra de botões do sistema
      await NavigationBar.setVisibilityAsync("hidden");
      
      // 'overlay-swipe' permite que a barra apareça sobre o app ao deslizar
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };

    hideNavBar();
  }, []);


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="BookDetailsScreen" />
        <Stack.Screen name="CheckoutScreen" />
        <Stack.Screen name="MyLibraryScreen" />
        <Stack.Screen name="CartScreen" />

        <Stack.Screen name="HomeScreen" />
        <Stack.Screen name="SearchScreen" />
        <Stack.Screen name="ProfileScreen" />
        <Stack.Screen name="EditProfileScreen" />
        <Stack.Screen name="MyOrdersScreen" />
        <Stack.Screen name="OrderDetailScreen" />
        <Stack.Screen name="AddressListScreen" />
        <Stack.Screen name="AddressFormScreen" />

        <Stack.Screen name="AdminDashboardScreen" />
        <Stack.Screen name="OrderConfirmationScreen" />
        <Stack.Screen name="AdminProductListScreen" />
        <Stack.Screen name="AdminProductFormScreen" />
        <Stack.Screen name="JsonDataScreen" />
        <Stack.Screen name="UserListScreen" />
        <Stack.Screen name="AdminCategoryListScreen" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}